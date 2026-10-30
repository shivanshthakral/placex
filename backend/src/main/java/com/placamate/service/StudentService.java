package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.exception.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.*;
import java.util.UUID;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private static final String UPLOAD_DIR = "./uploads/resumes/";

    public StudentService(StudentRepository studentRepository, UserRepository userRepository) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }

    public StudentProfileDto getProfile(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return toDto(student);
    }

    public StudentProfileDto updateProfile(User user, StudentUpdateRequest request) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (request.getName() != null) {
            user.setName(request.getName());
            userRepository.save(user);
        }
        if (request.getRegistrationNumber() != null) student.setRegistrationNumber(request.getRegistrationNumber());
        if (request.getDepartment() != null) student.setDepartment(request.getDepartment());
        if (request.getDegree() != null) student.setDegree(request.getDegree());
        if (request.getGraduationYear() != null) student.setGraduationYear(request.getGraduationYear());
        if (request.getCgpa() != null) student.setCgpa(request.getCgpa());
        if (request.getTenthPercentage() != null) student.setTenthPercentage(request.getTenthPercentage());
        if (request.getTwelfthPercentage() != null) student.setTwelfthPercentage(request.getTwelfthPercentage());
        if (request.getBacklogs() != null) student.setBacklogs(request.getBacklogs());
        if (request.getSkills() != null) student.setSkills(request.getSkills());
        if (request.getPhone() != null) student.setPhone(request.getPhone());
        if (request.getLinkedInUrl() != null) student.setLinkedInUrl(request.getLinkedInUrl());
        if (request.getGithubUrl() != null) student.setGithubUrl(request.getGithubUrl());

        student = studentRepository.save(student);
        return toDto(student);
    }

    public String uploadResume(User user, MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new BadRequestException("Only PDF files are accepted");
        }
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB max
            throw new BadRequestException("File size must be less than 5MB");
        }

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Files.createDirectories(uploadPath);

            String fileName = "resume_" + student.getId() + "_" + UUID.randomUUID().toString().substring(0, 8) + ".pdf";
            Path filePath = uploadPath.resolve(fileName);

            // Delete old resume if exists
            if (student.getResumePath() != null) {
                Path oldFile = Paths.get(UPLOAD_DIR + student.getResumePath());
                Files.deleteIfExists(oldFile);
            }

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            student.setResumePath(fileName);
            studentRepository.save(student);

            return fileName;
        } catch (IOException e) {
            throw new BadRequestException("Failed to upload resume: " + e.getMessage());
        }
    }

    public byte[] getResume(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (student.getResumePath() == null) {
            throw new ResourceNotFoundException("No resume uploaded");
        }

        try {
            Path filePath = Paths.get(UPLOAD_DIR + student.getResumePath());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Resume file not found");
        }
    }

    public byte[] getResumeByStudentId(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (student.getResumePath() == null) {
            throw new ResourceNotFoundException("No resume uploaded");
        }

        try {
            Path filePath = Paths.get(UPLOAD_DIR + student.getResumePath());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new ResourceNotFoundException("Resume file not found");
        }
    }

    public int calculateProfileCompletion(Student student) {
        int score = 0;
        int total = 100;

        // Personal details: 20%
        if (student.getUser().getName() != null && !student.getUser().getName().isBlank()) score += 5;
        if (student.getRegistrationNumber() != null && !student.getRegistrationNumber().isBlank()) score += 5;
        if (student.getPhone() != null && !student.getPhone().isBlank()) score += 5;
        if (student.getDepartment() != null && !student.getDepartment().isBlank()) score += 5;

        // Academic details: 30%
        if (student.getDegree() != null && !student.getDegree().isBlank()) score += 5;
        if (student.getGraduationYear() != null) score += 5;
        if (student.getCgpa() != null) score += 8;
        if (student.getTenthPercentage() != null) score += 6;
        if (student.getTwelfthPercentage() != null) score += 6;

        // Skills: 20%
        if (student.getSkills() != null && !student.getSkills().isBlank()) score += 20;

        // Resume: 20%
        if (student.getResumePath() != null && !student.getResumePath().isBlank()) score += 20;

        // Professional links: 10%
        if (student.getLinkedInUrl() != null && !student.getLinkedInUrl().isBlank()) score += 5;
        if (student.getGithubUrl() != null && !student.getGithubUrl().isBlank()) score += 5;

        return Math.min(score, total);
    }

    private StudentProfileDto toDto(Student student) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setName(student.getUser().getName());
        dto.setEmail(student.getUser().getEmail());
        dto.setRegistrationNumber(student.getRegistrationNumber());
        dto.setDepartment(student.getDepartment());
        dto.setDegree(student.getDegree());
        dto.setGraduationYear(student.getGraduationYear());
        dto.setCgpa(student.getCgpa());
        dto.setTenthPercentage(student.getTenthPercentage());
        dto.setTwelfthPercentage(student.getTwelfthPercentage());
        dto.setBacklogs(student.getBacklogs());
        dto.setSkills(student.getSkills());
        dto.setPhone(student.getPhone());
        dto.setLinkedInUrl(student.getLinkedInUrl());
        dto.setGithubUrl(student.getGithubUrl());
        dto.setResumeFileName(student.getResumePath());
        dto.setProfileCompletion(calculateProfileCompletion(student));
        return dto;
    }
}
