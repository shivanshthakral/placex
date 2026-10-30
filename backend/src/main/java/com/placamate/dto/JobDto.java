package com.placamate.dto;

import com.placamate.model.JobStatus;
import com.placamate.model.JobType;
import java.time.LocalDate;

public class JobDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyIndustry;
    private String companyLocation;
    private String title;
    private String description;
    private String location;
    private Double packageLpa;
    private JobType jobType;
    private Double minimumCgpa;
    private Double minimumTenthPercentage;
    private Double minimumTwelfthPercentage;
    private Integer maximumBacklogs;
    private Integer graduationYear;
    private String eligibleDepartments;
    private String requiredSkills;
    private String responsibilities;
    private String selectionProcess;
    private LocalDate deadline;
    private JobStatus status;
    private Boolean eligible;
    private String eligibilityReason;
    private Long applicantCount;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyIndustry() { return companyIndustry; }
    public void setCompanyIndustry(String companyIndustry) { this.companyIndustry = companyIndustry; }

    public String getCompanyLocation() { return companyLocation; }
    public void setCompanyLocation(String companyLocation) { this.companyLocation = companyLocation; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public JobType getJobType() { return jobType; }
    public void setJobType(JobType jobType) { this.jobType = jobType; }

    public Double getMinimumCgpa() { return minimumCgpa; }
    public void setMinimumCgpa(Double minimumCgpa) { this.minimumCgpa = minimumCgpa; }

    public Double getMinimumTenthPercentage() { return minimumTenthPercentage; }
    public void setMinimumTenthPercentage(Double minimumTenthPercentage) { this.minimumTenthPercentage = minimumTenthPercentage; }

    public Double getMinimumTwelfthPercentage() { return minimumTwelfthPercentage; }
    public void setMinimumTwelfthPercentage(Double minimumTwelfthPercentage) { this.minimumTwelfthPercentage = minimumTwelfthPercentage; }

    public Integer getMaximumBacklogs() { return maximumBacklogs; }
    public void setMaximumBacklogs(Integer maximumBacklogs) { this.maximumBacklogs = maximumBacklogs; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public String getEligibleDepartments() { return eligibleDepartments; }
    public void setEligibleDepartments(String eligibleDepartments) { this.eligibleDepartments = eligibleDepartments; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getResponsibilities() { return responsibilities; }
    public void setResponsibilities(String responsibilities) { this.responsibilities = responsibilities; }

    public String getSelectionProcess() { return selectionProcess; }
    public void setSelectionProcess(String selectionProcess) { this.selectionProcess = selectionProcess; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public Boolean getEligible() { return eligible; }
    public void setEligible(Boolean eligible) { this.eligible = eligible; }

    public String getEligibilityReason() { return eligibilityReason; }
    public void setEligibilityReason(String eligibilityReason) { this.eligibilityReason = eligibilityReason; }

    public Long getApplicantCount() { return applicantCount; }
    public void setApplicantCount(Long applicantCount) { this.applicantCount = applicantCount; }
}
