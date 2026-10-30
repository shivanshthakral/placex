package com.placamate.dto;

import java.util.Map;
import java.util.List;

public class DashboardDto {
    private long totalStudents;
    private long totalCompanies;
    private long activeOpportunities;
    private long totalApplications;
    private long studentsSelected;
    private double placementRate;
    private Map<String, Long> departmentWisePlacements;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> companyWiseSelections;
    private Map<Integer, Long> monthlyTrend;

    // Getters and Setters
    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public long getActiveOpportunities() { return activeOpportunities; }
    public void setActiveOpportunities(long activeOpportunities) { this.activeOpportunities = activeOpportunities; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getStudentsSelected() { return studentsSelected; }
    public void setStudentsSelected(long studentsSelected) { this.studentsSelected = studentsSelected; }

    public double getPlacementRate() { return placementRate; }
    public void setPlacementRate(double placementRate) { this.placementRate = placementRate; }

    public Map<String, Long> getDepartmentWisePlacements() { return departmentWisePlacements; }
    public void setDepartmentWisePlacements(Map<String, Long> departmentWisePlacements) { this.departmentWisePlacements = departmentWisePlacements; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    public Map<String, Long> getCompanyWiseSelections() { return companyWiseSelections; }
    public void setCompanyWiseSelections(Map<String, Long> companyWiseSelections) { this.companyWiseSelections = companyWiseSelections; }

    public Map<Integer, Long> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(Map<Integer, Long> monthlyTrend) { this.monthlyTrend = monthlyTrend; }
}
