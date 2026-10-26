package gov.aicte.regulaflow.exception;

public class InvalidWorkflowTransitionException extends RuntimeException {
    public InvalidWorkflowTransitionException(String currentStatus, String targetStatus, String role) {
        super(String.format("Invalid workflow transition from '%s' to '%s' requested by role '%s'.", currentStatus, targetStatus, role));
    }

    public InvalidWorkflowTransitionException(String message) {
        super(message);
    }
}
