package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobService jobService;
    private final AuthService authService;

    public JobController(JobService jobService, AuthService authService) {
        this.jobService = jobService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<List<JobDto>> getAllJobs(Authentication auth) {
        User user = null;
        if (auth != null && auth.isAuthenticated()) {
            try { user = authService.getUserByEmail(auth.getName()); } catch (Exception e) {}
        }
        return ResponseEntity.ok(jobService.getAllJobs(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDto> getJobById(@PathVariable Long id, Authentication auth) {
        User user = null;
        if (auth != null && auth.isAuthenticated()) {
            try { user = authService.getUserByEmail(auth.getName()); } catch (Exception e) {}
        }
        return ResponseEntity.ok(jobService.getJobById(id, user));
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<EligibilityResult> checkEligibility(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(jobService.checkEligibility(id, user));
    }

    @PostMapping
    public ResponseEntity<JobDto> createJob(Authentication auth, @Valid @RequestBody JobCreateRequest request) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(jobService.createJob(user, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<JobDto> updateJob(@PathVariable Long id, Authentication auth,
                                            @Valid @RequestBody JobCreateRequest request) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(jobService.updateJob(id, user, request));
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Void> closeJob(@PathVariable Long id, Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        jobService.closeJob(id, user);
        return ResponseEntity.ok().build();
    }
}
