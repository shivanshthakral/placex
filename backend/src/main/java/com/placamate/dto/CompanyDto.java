package com.placamate.dto;

public class CompanyDto {
    private Long id;
    private String name;
    private String industry;
    private String location;
    private String website;
    private String description;
    private Long jobCount;
    private Long applicationCount;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getJobCount() { return jobCount; }
    public void setJobCount(Long jobCount) { this.jobCount = jobCount; }

    public Long getApplicationCount() { return applicationCount; }
    public void setApplicationCount(Long applicationCount) { this.applicationCount = applicationCount; }
}
