package gov.aicte.regulaflow.dto;

public class UserDto {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private Long institutionId;
    private String institutionName;
    private String institutionAicteId;
    private String phone;
    private String department;
    private java.util.List<String> authorizedRoles;

    public UserDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Long getInstitutionId() { return institutionId; }
    public void setInstitutionId(Long institutionId) { this.institutionId = institutionId; }

    public String getInstitutionName() { return institutionName; }
    public void setInstitutionName(String institutionName) { this.institutionName = institutionName; }

    public String getInstitutionAicteId() { return institutionAicteId; }
    public void setInstitutionAicteId(String institutionAicteId) { this.institutionAicteId = institutionAicteId; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public java.util.List<String> getAuthorizedRoles() { return authorizedRoles; }
    public void setAuthorizedRoles(java.util.List<String> authorizedRoles) { this.authorizedRoles = authorizedRoles; }
}
