package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.exception.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final InterviewRepository interviewRepository;
    private final EligibilityService eligibilityService;
    private final NotificationService notificationService;

    public ApplicationService(JobApplicationRepository applicationRepository, JobRepository jobRepository,
                              StudentRepository studentRepository, RecruiterRepository recruiterRepository,
                              InterviewRepository interviewRepository, EligibilityService eligibilityService,
                              NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.interviewRepository = interviewRepository;
        this.eligibilityService = eligibilityService;
        this.notificationService = notificationService;
    }

    @Transactional
    public ApplicationDto applyForJob(User user, Long jobId) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        // Check job status
        if (job.getStatus() == JobStatus.CLOSED) {
            throw new BadRequestException("This job posting is closed");
        }

        // Check deadline
        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new BadRequestException("Application deadline has passed");
        }

        // Check duplicate
        if (applicationRepository.existsByStudentIdAndJobId(student.getId(), job.getId())) {
            throw new ConflictException("You have already applied for this job");
        }

        // Check eligibility
        EligibilityResult eligibility = eligibilityService.checkEligibility(student, job);
        if (!eligibility.isEligible()) {
            throw new BadRequestException(eligibility.getReason());
        }

        JobApplication application = new JobApplication(student, job);
        application = applicationRepository.save(application);

        return toDto(application);
    }

    public List<ApplicationDto> getMyApplications(User user) {
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        List<JobApplication> applications = applicationRepository.findByStudentId(student.getId());
        return applications.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ApplicationDto getApplicationById(Long id) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));
        return toDto(app);
    }

    @Transactional
    public ApplicationDto updateStatus(Long id, ApplicationStatus newStatus, User user) {
        JobApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found: " + id));

        // Check authorization for recruiter
        if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = recruiterRepository.findByUser(user)
                    .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
            if (!app.getJob().getCompany().getId().equals(recruiter.getCompany().getId())) {
                throw new ForbiddenException("You can only update applications for your company's jobs");
            }
        }

        app.setStatus(newStatus);
        app = applicationRepository.save(app);

        // Create notification for the student
        String title = "Application Status Update";
        String message = "Your application for " + app.getJob().getTitle() + " at " +
                app.getJob().getCompany().getName() + " has been updated to: " + newStatus.name();
        notificationService.createNotification(app.getStudent().getUser(), title, message);

        return toDto(app);
    }

    public List<ApplicationDto> getApplicationsByJobId(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByCompany(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        return applicationRepository.findByJobCompanyId(recruiter.getCompany().getId()).stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::toDto).collect(Collectors.toList());
    }

    private ApplicationDto toDto(JobApplication app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());
        dto.setStudentId(app.getStudent().getId());
        dto.setStudentName(app.getStudent().getUser().getName());
        dto.setStudentRegistrationNumber(app.getStudent().getRegistrationNumber());
        dto.setStudentDepartment(app.getStudent().getDepartment());
        dto.setStudentCgpa(app.getStudent().getCgpa());
        dto.setStudentSkills(app.getStudent().getSkills());
        dto.setStudentEmail(app.getStudent().getUser().getEmail());
        dto.setStudentPhone(app.getStudent().getPhone());
        dto.setHasResume(app.getStudent().getResumePath() != null);
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompanyName(app.getJob().getCompany().getName());
        dto.setPackageLpa(app.getJob().getPackageLpa());
        dto.setLocation(app.getJob().getLocation());
        dto.setApplicationDate(app.getApplicationDate());
        dto.setStatus(app.getStatus());

        // Get latest interview
        interviewRepository.findTopByApplicationIdOrderByScheduledAtDesc(app.getId())
                .ifPresent(interview -> {
                    InterviewDto interviewDto = new InterviewDto();
                    interviewDto.setId(interview.getId());
                    interviewDto.setApplicationId(interview.getApplication().getId());
                    interviewDto.setScheduledAt(interview.getScheduledAt());
                    interviewDto.setMode(interview.getMode());
                    interviewDto.setLocationOrMeetingLink(interview.getLocationOrMeetingLink());
                    interviewDto.setNotes(interview.getNotes());
                    dto.setLatestInterview(interviewDto);
                });

        return dto;
    }
}
