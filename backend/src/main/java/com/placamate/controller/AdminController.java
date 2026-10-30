package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AnalyticsService analyticsService;
    private final StudentService studentService;
    private final CompanyService companyService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final AuthService authService;
    private final com.placamate.repository.StudentRepository studentRepository;

    public AdminController(AnalyticsService analyticsService, StudentService studentService,
                           CompanyService companyService, JobService jobService,
                           ApplicationService applicationService, AuthService authService,
                           com.placamate.repository.StudentRepository studentRepository) {
        this.analyticsService = analyticsService;
        this.studentService = studentService;
        this.companyService = companyService;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.authService = authService;
        this.studentRepository = studentRepository;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardDto> getDashboard() {
        return ResponseEntity.ok(analyticsService.getAdminDashboard());
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfileDto>> getStudents() {
        List<StudentProfileDto> students = studentRepository.findAll().stream().map(s -> {
            StudentProfileDto dto = new StudentProfileDto();
            dto.setId(s.getId());
            dto.setUserId(s.getUser().getId());
            dto.setName(s.getUser().getName());
            dto.setEmail(s.getUser().getEmail());
            dto.setRegistrationNumber(s.getRegistrationNumber());
            dto.setDepartment(s.getDepartment());
            dto.setDegree(s.getDegree());
            dto.setGraduationYear(s.getGraduationYear());
            dto.setCgpa(s.getCgpa());
            dto.setTenthPercentage(s.getTenthPercentage());
            dto.setTwelfthPercentage(s.getTwelfthPercentage());
            dto.setBacklogs(s.getBacklogs());
            dto.setSkills(s.getSkills());
            dto.setPhone(s.getPhone());
            dto.setLinkedInUrl(s.getLinkedInUrl());
            dto.setGithubUrl(s.getGithubUrl());
            dto.setResumeFileName(s.getResumePath());
            dto.setProfileCompletion(studentService.calculateProfileCompletion(s));
            return dto;
        }).collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyDto>> getCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PostMapping("/companies")
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(companyService.createCompany(request));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<JobDto>> getJobs(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(jobService.getAllJobs(user));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationDto>> getApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/analytics")
    public ResponseEntity<DashboardDto> getAnalytics() {
        return ResponseEntity.ok(analyticsService.getAdminDashboard());
    }
}
