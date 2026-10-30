package com.placamate.service;

import com.placamate.dto.*;
import com.placamate.exception.*;
import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final RecruiterRepository recruiterRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;

    public CompanyService(CompanyRepository companyRepository, RecruiterRepository recruiterRepository,
                          JobRepository jobRepository, JobApplicationRepository applicationRepository) {
        this.companyRepository = companyRepository;
        this.recruiterRepository = recruiterRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
    }

    public CompanyDto getCompanyForRecruiter(User user) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        return toDto(recruiter.getCompany());
    }

    public CompanyDto updateCompany(User user, CompanyDto request) {
        Recruiter recruiter = recruiterRepository.findByUser(user)
                .orElseThrow(() -> new ForbiddenException("Recruiter profile not found"));
        Company company = recruiter.getCompany();

        if (request.getName() != null) company.setName(request.getName());
        if (request.getIndustry() != null) company.setIndustry(request.getIndustry());
        if (request.getLocation() != null) company.setLocation(request.getLocation());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
        if (request.getDescription() != null) company.setDescription(request.getDescription());

        company = companyRepository.save(company);
        return toDto(company);
    }

    public CompanyDto createCompany(CompanyDto request) {
        Company company = new Company();
        company.setName(request.getName());
        company.setIndustry(request.getIndustry());
        company.setLocation(request.getLocation());
        company.setWebsite(request.getWebsite());
        company.setDescription(request.getDescription());
        company = companyRepository.save(company);
        return toDto(company);
    }

    public java.util.List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(this::toDto)
                .collect(java.util.stream.Collectors.toList());
    }

    private CompanyDto toDto(Company company) {
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setName(company.getName());
        dto.setIndustry(company.getIndustry());
        dto.setLocation(company.getLocation());
        dto.setWebsite(company.getWebsite());
        dto.setDescription(company.getDescription());
        dto.setJobCount(jobRepository.countByCompanyId(company.getId()));
        dto.setApplicationCount(applicationRepository.countByJobCompanyId(company.getId()));
        return dto;
    }
}
