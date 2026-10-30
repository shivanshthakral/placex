package com.placamate.controller;

import com.placamate.dto.*;
import com.placamate.model.User;
import com.placamate.service.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final AuthService authService;

    public StudentController(StudentService studentService, AuthService authService) {
        this.studentService = studentService;
        this.authService = authService;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileDto> getProfile(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(studentService.getProfile(user));
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfileDto> updateProfile(Authentication auth, @RequestBody StudentUpdateRequest request) {
        User user = authService.getUserByEmail(auth.getName());
        return ResponseEntity.ok(studentService.updateProfile(user, request));
    }

    @PostMapping("/me/resume")
    public ResponseEntity<java.util.Map<String, String>> uploadResume(Authentication auth, @RequestParam("file") MultipartFile file) {
        User user = authService.getUserByEmail(auth.getName());
        String fileName = studentService.uploadResume(user, file);
        return ResponseEntity.ok(java.util.Map.of("fileName", fileName, "message", "Resume uploaded successfully"));
    }

    @GetMapping("/me/resume")
    public ResponseEntity<byte[]> getResume(Authentication auth) {
        User user = authService.getUserByEmail(auth.getName());
        byte[] content = studentService.getResume(user);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"resume.pdf\"")
                .body(content);
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> getResumeById(@PathVariable Long id) {
        byte[] content = studentService.getResumeByStudentId(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"resume.pdf\"")
                .body(content);
    }
}
