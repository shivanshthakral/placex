package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;
    private final AuthService authService;

    public InterviewController(InterviewService interviewService, AuthService authService) {
        this.interviewService = interviewService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<InterviewDto> schedule(Authentication auth,
                                                  @Valid @RequestBody InterviewCreateRequest request) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(interviewService.scheduleInterview(user, request));
    }

    @GetMapping("/me")
    public ResponseEntity<java.util.List<InterviewDto>> getMyInterviews(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(interviewService.getStudentInterviews(user));
    }
}
