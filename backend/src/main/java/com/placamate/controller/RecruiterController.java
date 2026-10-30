package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
public class RecruiterController {

    private final JobService jobService;
    private final ApplicationService applicationService;
    private final CompanyService companyService;
    private final AnalyticsService analyticsService;
    private final AuthService authService;

    public RecruiterController(JobService jobService, ApplicationService applicationService,
                               CompanyService companyService, AnalyticsService analyticsService,
                               AuthService authService) {
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.companyService = companyService;
        this.analyticsService = analyticsService;
        this.authService = authService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(analyticsService.getRecruiterDashboard(user));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getJobs(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(jobService.getRecruiterJobs(user));
    }

    @GetMapping("/jobs/{id}/applicants")
    public ResponseEntity<List<ApplicationDto>> getApplicants(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationsByJobId(id));
    }

    @GetMapping("/applicants")
    public ResponseEntity<List<ApplicationDto>> getAllApplicants(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(applicationService.getApplicationsByCompany(user));
    }

    @GetMapping("/company")
    public ResponseEntity<CompanyDto> getCompany(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(companyService.getCompanyForRecruiter(user));
    }

    @PutMapping("/company")
    public ResponseEntity<CompanyDto> updateCompany(Authentication auth, @RequestBody CompanyDto request) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(companyService.updateCompany(user, request));
    }
}
