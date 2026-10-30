package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AnalyticsService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final RecruiterRepository recruiterRepository;

    public AnalyticsService(StudentRepository studentRepository, CompanyRepository companyRepository,
                            JobRepository jobRepository, JobApplicationRepository applicationRepository,
                            RecruiterRepository recruiterRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.recruiterRepository = recruiterRepository;
    }

    public DashboardDto getAdminDashboard() {
        DashboardDto dto = new DashboardDto();
        dto.setTotalStudents(studentRepository.count());
        dto.setTotalCompanies(companyRepository.count());
        dto.setActiveOpportunities(jobRepository.countByStatus(JobStatus.OPEN));
        dto.setTotalApplications(applicationRepository.count());

        long selectedStudents = applicationRepository.countDistinctStudentsByStatus(ApplicationStatus.SELECTED);
        dto.setStudentsSelected(selectedStudents);

        long totalStudents = studentRepository.count();
        dto.setPlacementRate(totalStudents > 0 ? Math.round((double) selectedStudents / totalStudents * 10000.0) / 100.0 : 0);

        // Department-wise placements
        Map<String, Long> deptPlacements = new LinkedHashMap<>();
        applicationRepository.countDistinctStudentsByStatusGroupByDepartment(ApplicationStatus.SELECTED)
                .forEach(row -> deptPlacements.put((String) row[0], (Long) row[1]));
        dto.setDepartmentWisePlacements(deptPlacements);

        // Status distribution
        Map<String, Long> statusDist = new LinkedHashMap<>();
        applicationRepository.countGroupByStatus()
                .forEach(row -> statusDist.put(((ApplicationStatus) row[0]).name(), (Long) row[1]));
        dto.setStatusDistribution(statusDist);

        // Company-wise selections
        Map<String, Long> companySelections = new LinkedHashMap<>();
        applicationRepository.countByStatusGroupByCompany(ApplicationStatus.SELECTED)
                .forEach(row -> companySelections.put((String) row[0], (Long) row[1]));
        dto.setCompanyWiseSelections(companySelections);

        // Monthly trend
        Map<Integer, Long> monthlyTrend = new LinkedHashMap<>();
        applicationRepository.countGroupByMonth()
                .forEach(row -> monthlyTrend.put(((Number) row[0]).intValue(), (Long) row[1]));
        dto.setMonthlyTrend(monthlyTrend);

        return dto;
    }

    public Map<String, Object> getRecruiterDashboard(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new com.placamate.exception.ForbiddenException("Recruiter profile not found"));
        Long companyId = recruiter.getCompany().getId();

        Map<String, Object> dashboard = new LinkedHashMap<>();
        List<Job> jobs = jobRepository.findByCompanyId(companyId);
        dashboard.put("totalJobPostings", (long) jobs.size());
        dashboard.put("activeOpenings", jobs.stream().filter(j -> j.getStatus() == JobStatus.OPEN).count());

        long totalApps = applicationRepository.countByJobCompanyId(companyId);
        dashboard.put("applicationsReceived", totalApps);

        List<JobApplication> companyApps = applicationRepository.findByJobCompanyId(companyId);
        long shortlisted = companyApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED
                || a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED
                || a.getStatus() == ApplicationStatus.SELECTED).count();
        dashboard.put("candidatesShortlisted", shortlisted);
        dashboard.put("candidatesSelected", companyApps.stream()
                .filter(a -> a.getStatus() == ApplicationStatus.SELECTED).count());

        return dashboard;
    }
}
