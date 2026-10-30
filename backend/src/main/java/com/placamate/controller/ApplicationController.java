package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final AuthService authService;

    public ApplicationController(ApplicationService applicationService, AuthService authService) {
        this.applicationService = applicationService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ApplicationDto> apply(Authentication auth, @RequestBody Map<String, Long> body) {
        User user = authService.getUserByEmail(auth.getName());
        Long jobId = body.get("jobId");
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.applyForJob(user, jobId));
    }

    @GetMapping("/me")
    public ResponseEntity<List<ApplicationDto>> getMyApplications(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(applicationService.getMyApplications(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationDto> getApplication(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationDto> updateStatus(@PathVariable Long id,
                                                        @Valid @RequestBody StatusUpdateRequest request,
                                                        Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(applicationService.updateStatus(id, request.getStatus(), user));
    }
}
