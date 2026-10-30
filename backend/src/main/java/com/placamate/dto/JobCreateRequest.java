package com.placamate.dto;

import com.placamate.model.JobType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class JobCreateRequest {
    @NotBlank(message = "Title is required")
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

    // Getters and Setters
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
}
