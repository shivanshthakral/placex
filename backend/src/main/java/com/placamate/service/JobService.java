package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.exception.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final StudentRepository studentRepository;
    private final JobApplicationRepository applicationRepository;
    private final EligibilityService eligibilityService;

    public JobService(JobRepository jobRepository, CompanyRepository companyRepository,
                      RecruiterRepository recruiterRepository, StudentRepository studentRepository,
                      JobApplicationRepository applicationRepository, EligibilityService eligibilityService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.recruiterRepository = recruiterRepository;
        this.studentRepository = studentRepository;
        this.applicationRepository = applicationRepository;
        this.eligibilityService = eligibilityService;
    }

    public List<JobDto> getAllJobs(User currentUser) {
        List<Job> jobs = jobRepository.findAll();
        Student student = null;
        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            student = studentRepository.findByUser(currentUser).orElse(null);
        }
        Student finalStudent = student;
        return jobs.stream().map(j -> toDto(j, finalStudent)).collect(Collectors.toList());
    }

    public JobDto getJobById(Long id, User currentUser) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));
        Student student = null;
        if (currentUser != null && currentUser.getRole() == Role.STUDENT) {
            student = studentRepository.findByUser(currentUser).orElse(null);
        }
        return toDto(job, student);
    }

    public EligibilityResult checkEligibility(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return eligibilityService.checkEligibility(student, job);
    }

    public JobDto createJob(User user, JobCreateRequest request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));

        Job job = new Job();
        job.setCompany(recruiter.getCompany());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setPackageLpa(request.getPackageLpa());
        job.setJobType(request.getJobType());
        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setMinimumTenthPercentage(request.getMinimumTenthPercentage());
        job.setMinimumTwelfthPercentage(request.getMinimumTwelfthPercentage());
        job.setMaximumBacklogs(request.getMaximumBacklogs());
        job.setGraduationYear(request.getGraduationYear());
        job.setEligibleDepartments(request.getEligibleDepartments());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setResponsibilities(request.getResponsibilities());
        job.setSelectionProcess(request.getSelectionProcess());
        job.setDeadline(request.getDeadline());
        job.setStatus(JobStatus.OPEN);

        job = jobRepository.save(job);
        return toDto(job, null);
    }

    public JobDto updateJob(Long id, User user, JobCreateRequest request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));

        if (!job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You can only edit your own company's jobs");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setPackageLpa(request.getPackageLpa());
        job.setJobType(request.getJobType());
        job.setMinimumCgpa(request.getMinimumCgpa());
        job.setMinimumTenthPercentage(request.getMinimumTenthPercentage());
        job.setMinimumTwelfthPercentage(request.getMinimumTwelfthPercentage());
        job.setMaximumBacklogs(request.getMaximumBacklogs());
        job.setGraduationYear(request.getGraduationYear());
        job.setEligibleDepartments(request.getEligibleDepartments());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setResponsibilities(request.getResponsibilities());
        job.setSelectionProcess(request.getSelectionProcess());
        job.setDeadline(request.getDeadline());

        job = jobRepository.save(job);
        return toDto(job, null);
    }

    public void closeJob(Long id, User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));

        if (!job.getCompany().getId().equals(recruiter.getCompany().getId())) {
            throw new ForbiddenException("You can only close your own company's jobs");
        }

        job.setStatus(JobStatus.CLOSED);
        jobRepository.save(job);
    }

    public List<JobDto> getRecruiterJobs(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        List<Job> jobs = jobRepository.findByCompany(recruiter.getCompany());
        return jobs.stream().map(j -> toDto(j, null)).collect(Collectors.toList());
    }

    private JobDto toDto(Job job, Student student) {
        JobDto dto = new JobDto();
        dto.setId(job.getId());
        dto.setCompanyId(job.getCompany().getId());
        dto.setCompanyName(job.getCompany().getName());
        dto.setCompanyIndustry(job.getCompany().getIndustry());
        dto.setCompanyLocation(job.getCompany().getLocation());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setLocation(job.getLocation());
        dto.setPackageLpa(job.getPackageLpa());
        dto.setJobType(job.getJobType());
        dto.setMinimumCgpa(job.getMinimumCgpa());
        dto.setMinimumTenthPercentage(job.getMinimumTenthPercentage());
        dto.setMinimumTwelfthPercentage(job.getMinimumTwelfthPercentage());
        dto.setMaximumBacklogs(job.getMaximumBacklogs());
        dto.setGraduationYear(job.getGraduationYear());
        dto.setEligibleDepartments(job.getEligibleDepartments());
        dto.setRequiredSkills(job.getRequiredSkills());
        dto.setResponsibilities(job.getResponsibilities());
        dto.setSelectionProcess(job.getSelectionProcess());
        dto.setDeadline(job.getDeadline());
        dto.setStatus(job.getStatus());
        dto.setApplicantCount((long) applicationRepository.findByJobId(job.getId()).size());

        if (student != null) {
            EligibilityResult eligibility = eligibilityService.checkEligibility(student, job);
            dto.setEligible(eligibility.isEligible());
            dto.setEligibilityReason(eligibility.getReason());
        }

        return dto;
    }
}
