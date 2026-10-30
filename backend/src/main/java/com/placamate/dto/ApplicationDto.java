package com.placamate.dto;

import com.placamate.model.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRegistrationNumber;
    private String studentDepartment;
    private Double studentCgpa;
    private String studentSkills;
    private String studentEmail;
    private String studentPhone;
    private boolean hasResume;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Double packageLpa;
    private String location;
    private LocalDateTime applicationDate;
    private ApplicationStatus status;
    private InterviewDto latestInterview;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentRegistrationNumber() { return studentRegistrationNumber; }
    public void setStudentRegistrationNumber(String reg) { this.studentRegistrationNumber = reg; }

    public String getStudentDepartment() { return studentDepartment; }
    public void setStudentDepartment(String studentDepartment) { this.studentDepartment = studentDepartment; }

    public Double getStudentCgpa() { return studentCgpa; }
    public void setStudentCgpa(Double studentCgpa) { this.studentCgpa = studentCgpa; }

    public String getStudentSkills() { return studentSkills; }
    public void setStudentSkills(String studentSkills) { this.studentSkills = studentSkills; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentPhone() { return studentPhone; }
    public void setStudentPhone(String studentPhone) { this.studentPhone = studentPhone; }

    public boolean isHasResume() { return hasResume; }
    public void setHasResume(boolean hasResume) { this.hasResume = hasResume; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public LocalDateTime getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDateTime applicationDate) { this.applicationDate = applicationDate; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public InterviewDto getLatestInterview() { return latestInterview; }
    public void setLatestInterview(InterviewDto latestInterview) { this.latestInterview = latestInterview; }
}
