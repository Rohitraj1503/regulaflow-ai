package gov.aicte.regulaflow.controller;


import gov.aicte.regulaflow.dto.ApplicationDto;
import gov.aicte.regulaflow.dto.OfficerDto;
import gov.aicte.regulaflow.security.JwtAuthenticationFilter;
import gov.aicte.regulaflow.security.UserPrincipal;
import gov.aicte.regulaflow.service.ApplicationWorkflowService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
@AutoConfigureMockMvc(addFilters = false)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ApplicationWorkflowService workflowService;

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Test
    @DisplayName("GET /api/v1/applications/officers returns list of eligible officers")
    void testGetEligibleOfficers() throws Exception {
        OfficerDto officer1 = new OfficerDto(2L, "reg_officer", "Rajesh K. Verma", "reg@aicte.gov", "ROLE_REGULATORY_OFFICER", "Approval Bureau", true);
        OfficerDto officer2 = new OfficerDto(3L, "scrutiny_officer", "Prof. Sunita Deshmukh", "scrutiny@aicte.gov", "ROLE_SCRUTINY_OFFICER", "Scrutiny Cell", true);

        when(workflowService.getEligibleOfficers()).thenReturn(List.of(officer1, officer2));

        mockMvc.perform(get("/api/v1/applications/officers")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(2))
                .andExpect(jsonPath("$[0].fullName").value("Rajesh K. Verma"))
                .andExpect(jsonPath("$[0].department").value("Approval Bureau"))
                .andExpect(jsonPath("$[1].id").value(3))
                .andExpect(jsonPath("$[1].fullName").value("Prof. Sunita Deshmukh"));
    }

    @Test
    @DisplayName("POST /api/v1/applications/{id}/assign delegates to service and returns updated application")
    void testAssignOfficerEndpoint() throws Exception {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(1L);
        dto.setApplicationNumber("APP-2026-001");
        dto.setAssignedOfficerId(2L);
        dto.setAssignedOfficerName("Rajesh K. Verma");

        when(workflowService.assignOfficer(eq(1L), eq(2L), any())).thenReturn(dto);

        mockMvc.perform(post("/api/v1/applications/1/assign")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"officerId\": 2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.applicationNumber").value("APP-2026-001"))
                .andExpect(jsonPath("$.assignedOfficerId").value(2))
                .andExpect(jsonPath("$.assignedOfficerName").value("Rajesh K. Verma"));
    }
}
