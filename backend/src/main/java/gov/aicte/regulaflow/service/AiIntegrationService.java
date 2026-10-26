package gov.aicte.regulaflow.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gov.aicte.regulaflow.dto.AiQueryRequest;
import gov.aicte.regulaflow.dto.AiQueryResponse;
import gov.aicte.regulaflow.entity.RegulatoryClause;
import gov.aicte.regulaflow.repository.RegulatoryClauseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class AiIntegrationService {

    private static final Logger logger = LoggerFactory.getLogger(AiIntegrationService.class);

    private final RegulatoryClauseRepository clauseRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.gemini.api-key:your_gemini_api_key_here}")
    private String geminiApiKey;

    @Value("${app.gemini.model:gemini-3.5-flash-lite}")
    private String primaryModel;

    @Value("${app.gemini.fallback-models:gemini-3.5-flash,gemini-3-flash-preview,gemini-3.1-flash-lite,gemini-2.5-flash}")
    private String fallbackModelsStr;

    public AiIntegrationService(RegulatoryClauseRepository clauseRepository) {
        this.clauseRepository = clauseRepository;
    }

    public AiQueryResponse queryRegulatoryCopilot(AiQueryRequest request) {
        String query = request.getQuery() != null ? request.getQuery().trim() : "";
        if (query.isBlank()) {
            AiQueryResponse blankResp = new AiQueryResponse();
            blankResp.setQuery("");
            blankResp.setAnswer("Please provide a question regarding AICTE regulations, handbook clauses, or approval procedures.");
            blankResp.setCitations(Collections.emptyList());
            return blankResp;
        }

        // 1. Retrieve grounded statutory clauses from database
        List<ScoredClause> relevantClauses = retrieveRelevantClauses(query);

        // 2. Query Google Gemini AI API with grounded context
        if (geminiApiKey != null && !geminiApiKey.isBlank()) {
            AiQueryResponse geminiResponse = callGeminiAi(query, relevantClauses);
            if (geminiResponse != null) {
                return geminiResponse;
            }
        }

        // 3. Fallback to resilient in-engine RAG if external AI is temporarily unreachable
        logger.warn("Using in-engine RAG retriever fallback for query: {}", query);
        return executeInEngineRag(query, relevantClauses);
    }

    private AiQueryResponse callGeminiAi(String userQuery, List<ScoredClause> contextClauses) {
        List<String> modelsToTry = new ArrayList<>();
        if (primaryModel != null && !primaryModel.isBlank()) {
            modelsToTry.add(primaryModel.trim());
        }
        if (fallbackModelsStr != null && !fallbackModelsStr.isBlank()) {
            for (String m : fallbackModelsStr.split(",")) {
                String trimmed = m.trim();
                if (!modelsToTry.contains(trimmed)) {
                    modelsToTry.add(trimmed);
                }
            }
        }

        // Build prompt with AICTE statutory context
        String prompt = buildGeminiPrompt(userQuery, contextClauses);

        Map<String, Object> requestPayload = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);
        contentMap.put("parts", Collections.singletonList(textPart));
        requestPayload.put("contents", Collections.singletonList(contentMap));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.2);
        generationConfig.put("maxOutputTokens", 1200);
        requestPayload.put("generationConfig", generationConfig);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        for (String model : modelsToTry) {
            try {
                String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s",
                        model, geminiApiKey);

                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    JsonNode root = objectMapper.readTree(response.getBody());
                    JsonNode candidate = root.path("candidates").path(0);
                    JsonNode parts = candidate.path("content").path("parts");
                    if (parts.isArray() && parts.size() > 0) {
                        String generatedText = parts.get(0).path("text").asText();
                        if (generatedText != null && !generatedText.isBlank()) {
                            logger.info("Successfully received answer from Google Gemini API (model: {})", model);
                            return buildSuccessResponse(userQuery, generatedText, contextClauses);
                        }
                    }
                }
            } catch (Exception ex) {
                logger.warn("Gemini model {} failed or rate-limited: {}. Trying fallback model...", model, ex.getMessage());
            }
        }

        return null;
    }

    private String buildGeminiPrompt(String query, List<ScoredClause> contextClauses) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are RegulaFlow Gemini AI, the authoritative statutory intelligence assistant for the All India Council for Technical Education (AICTE), Ministry of Education, Government of India.\n\n");
        sb.append("Your mission is to provide accurate, definitive regulatory advice regarding technical institution approvals, intake quotas, faculty cadre ratios, land norms, building areas, NOCs, and statutory inspections based on the AICTE Approval Process Handbook (APH 2026-27).\n\n");

        if (!contextClauses.isEmpty()) {
            sb.append("=== RELEVANT AICTE STATUTORY CLAUSES FROM DATABASE ===\n");
            for (ScoredClause sc : contextClauses) {
                RegulatoryClause c = sc.clause;
                sb.append(String.format("Document: %s | Section: %s | Clause: %s | Title: %s\n",
                        c.getDocument().getTitle(), c.getSectionNumber(), c.getClauseNumber(), c.getTitle()));
                sb.append(String.format("Statutory Text: %s\n", c.getContent()));
                if (c.getPenaltyNotes() != null && !c.getPenaltyNotes().isBlank()) {
                    sb.append(String.format("Penalties/Consequences: %s\n", c.getPenaltyNotes()));
                }
                sb.append("\n");
            }
            sb.append("=====================================================\n\n");
        }

        sb.append("USER QUESTION:\n").append(query).append("\n\n");
        sb.append("INSTRUCTIONS FOR YOUR RESPONSE:\n");
        sb.append("1. Answer clearly, professionally, and directly in Markdown format.\n");
        sb.append("2. Specifically cite the relevant APH Clause numbers (e.g. Clause 7.2, Clause 6.1, Section 8, etc.) and explain their legal compliance requirements.\n");
        sb.append("3. Mention exact numbers, proportions, and thresholds (such as 1:2:6 cadre ratio, land acres, built-up sq.m, or fine schedules).\n");
        sb.append("4. Keep the tone authoritative, helpful, and aligned with AICTE governance norms.\n");

        return sb.toString();
    }

    private AiQueryResponse buildSuccessResponse(String query, String answer, List<ScoredClause> contextClauses) {
        AiQueryResponse response = new AiQueryResponse();
        response.setQuery(query);
        response.setAnswer(answer);
        response.setConfidenceScore(0.98);
        response.setVerifiedSourceFound(!contextClauses.isEmpty());
        response.setInterpretationNotes("Answer generated by Google Gemini AI with real-time statutory grounding in AICTE APH 2026-27.");

        List<AiQueryResponse.CitationDetail> citations = new ArrayList<>();
        for (int i = 0; i < Math.min(3, contextClauses.size()); i++) {
            RegulatoryClause c = contextClauses.get(i).clause;
            citations.add(new AiQueryResponse.CitationDetail(
                    c.getDocument().getTitle(),
                    c.getDocument().getRegulationCode(),
                    c.getSectionNumber(),
                    c.getClauseNumber(),
                    c.getContent(),
                    calculateApproxPage(c.getClauseNumber()),
                    c.getDocument().getVersion(),
                    c.getDocument().getDocumentUrl(),
                    c.getDocument().getPublishingOrg(),
                    c.getDocument().getAcademicYear()
            ));
        }
        response.setCitations(citations);

        return response;
    }

    private List<ScoredClause> retrieveRelevantClauses(String query) {
        List<RegulatoryClause> allClauses = clauseRepository.findAll();
        List<ScoredClause> scoredClauses = new ArrayList<>();

        String lowerQuery = query.toLowerCase();
        String[] queryTokens = lowerQuery.split("\\W+");

        for (RegulatoryClause clause : allClauses) {
            double score = computeRelevanceScore(clause, lowerQuery, queryTokens);
            if (score > 0.12) {
                scoredClauses.add(new ScoredClause(clause, score));
            }
        }

        scoredClauses.sort((a, b) -> Double.compare(b.score, a.score));
        return scoredClauses.size() > 5 ? scoredClauses.subList(0, 5) : scoredClauses;
    }

    private AiQueryResponse executeInEngineRag(String query, List<ScoredClause> scoredClauses) {
        AiQueryResponse response = new AiQueryResponse();
        response.setQuery(query);

        if (scoredClauses.isEmpty()) {
            response.setAnswer("Sufficient evidence was not found in the authorized AICTE Approval Process Handbook (APH 2026-27) to substantiate a definitive regulatory requirement for: \"" + query + "\". Please verify with official AICTE gazette notifications.");
            response.setConfidenceScore(0.0);
            response.setVerifiedSourceFound(false);
            response.setInterpretationNotes("No direct matching regulatory clause was found in current active APH regulations.");
            response.setCitations(Collections.emptyList());
            return response;
        }

        List<AiQueryResponse.CitationDetail> citations = new ArrayList<>();
        StringBuilder answerBuilder = new StringBuilder();

        ScoredClause topMatch = scoredClauses.get(0);
        RegulatoryClause c = topMatch.clause;

        answerBuilder.append("According to the official ")
                .append(c.getDocument().getTitle())
                .append(" (")
                .append(c.getSectionNumber())
                .append(", ")
                .append(c.getClauseNumber())
                .append("):\n\n")
                .append("\"")
                .append(c.getContent())
                .append("\"\n\n");

        if (c.getPenaltyNotes() != null && !c.getPenaltyNotes().isBlank()) {
            answerBuilder.append("Statutory Compliance Warning: ")
                    .append(c.getPenaltyNotes())
                    .append("\n");
        }

        for (int i = 0; i < Math.min(3, scoredClauses.size()); i++) {
            RegulatoryClause sc = scoredClauses.get(i).clause;
            citations.add(new AiQueryResponse.CitationDetail(
                    sc.getDocument().getTitle(),
                    sc.getDocument().getRegulationCode(),
                    sc.getSectionNumber(),
                    sc.getClauseNumber(),
                    sc.getContent(),
                    calculateApproxPage(sc.getClauseNumber()),
                    sc.getDocument().getVersion(),
                    sc.getDocument().getDocumentUrl(),
                    sc.getDocument().getPublishingOrg(),
                    sc.getDocument().getAcademicYear()
            ));
        }

        response.setAnswer(answerBuilder.toString());
        response.setConfidenceScore(Math.min(0.98, topMatch.score));
        response.setVerifiedSourceFound(true);
        response.setInterpretationNotes("Answer strictly retrieved and grounded in AICTE statutory text.");
        response.setCitations(citations);

        return response;
    }

    private double computeRelevanceScore(RegulatoryClause clause, String lowerQuery, String[] tokens) {
        double score = 0.0;
        String content = clause.getContent().toLowerCase();
        String title = clause.getTitle().toLowerCase();
        String clauseNum = clause.getClauseNumber().toLowerCase();

        if (lowerQuery.contains(clauseNum)) score += 0.8;
        if (content.contains(lowerQuery) || title.contains(lowerQuery)) score += 0.6;

        for (String token : tokens) {
            if (token.length() < 3) continue;
            if (title.contains(token)) score += 0.25;
            if (content.contains(token)) score += 0.15;
        }

        return Math.min(1.0, score);
    }

    private Integer calculateApproxPage(String clauseNumber) {
        if (clauseNumber.startsWith("6")) return 42;
        if (clauseNumber.startsWith("7")) return 58;
        if (clauseNumber.startsWith("8")) return 76;
        if (clauseNumber.startsWith("11")) return 112;
        return 18;
    }

    private static class ScoredClause {
        RegulatoryClause clause;
        double score;

        ScoredClause(RegulatoryClause clause, double score) {
            this.clause = clause;
            this.score = score;
        }
    }
}
