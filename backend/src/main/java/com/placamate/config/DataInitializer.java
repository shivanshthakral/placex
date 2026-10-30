package com.placamate.config;

import com.placamate.model.*;
import com.placamate.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final JobApplicationRepository applicationRepository;
    private final InterviewRepository interviewRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           StudentRepository studentRepository,
                           RecruiterRepository recruiterRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           JobApplicationRepository applicationRepository,
                           InterviewRepository interviewRepository,
                           NotificationRepository notificationRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRepository = interviewRepository;
        this.notificationRepository = notificationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already initialized
        }

        System.out.println("🌱 Initializing PLACAMATE database with rich campus placement demo dataset...");

        // ==========================================
        // 1. PLACEMENT OFFICER (ADMIN)
        // ==========================================
        User officerUser = new User();
        officerUser.setName("Dr. K. S. Ravichandran");
        officerUser.setEmail("officer@srmist.edu.in");
        officerUser.setPasswordHash(passwordEncoder.encode("officer123"));
        officerUser.setRole(Role.PLACEMENT_OFFICER);
        userRepository.save(officerUser);

        // ==========================================
        // 2. COMPANIES & RECRUITERS
        // ==========================================
        // Google
        Company google = new Company();
        google.setName("Google");
        google.setDescription("Google is a global technology leader focusing on search, cloud computing, software, and hardware innovation.");
        google.setIndustry("Technology & Cloud");
        google.setWebsite("https://careers.google.com");
        google.setLocation("Bangalore, Karnataka");
        companyRepository.save(google);

        User googleRecruiterUser = new User();
        googleRecruiterUser.setName("Sundararajan Ramesh");
        googleRecruiterUser.setEmail("recruiter@google.com");
        googleRecruiterUser.setPasswordHash(passwordEncoder.encode("google123"));
        googleRecruiterUser.setRole(Role.RECRUITER);
        userRepository.save(googleRecruiterUser);

        Recruiter googleRecruiter = new Recruiter();
        googleRecruiter.setUser(googleRecruiterUser);
        googleRecruiter.setCompany(google);
        recruiterRepository.save(googleRecruiter);

        // Microsoft
        Company microsoft = new Company();
        microsoft.setName("Microsoft");
        microsoft.setDescription("Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge.");
        microsoft.setIndustry("Enterprise Software & AI");
        microsoft.setWebsite("https://careers.microsoft.com");
        microsoft.setLocation("Hyderabad, Telangana");
        companyRepository.save(microsoft);

        User msftRecruiterUser = new User();
        msftRecruiterUser.setName("Ananya Deshmukh");
        msftRecruiterUser.setEmail("recruiter@microsoft.com");
        msftRecruiterUser.setPasswordHash(passwordEncoder.encode("msft123"));
        msftRecruiterUser.setRole(Role.RECRUITER);
        userRepository.save(msftRecruiterUser);

        Recruiter msftRecruiter = new Recruiter();
        msftRecruiter.setUser(msftRecruiterUser);
        msftRecruiter.setCompany(microsoft);
        recruiterRepository.save(msftRecruiter);

        // Amazon
        Company amazon = new Company();
        amazon.setName("Amazon");
        amazon.setDescription("Earth's most customer-centric company, innovating across e-commerce, AWS cloud, and cutting-edge logistics.");
        amazon.setIndustry("E-Commerce & Cloud Infrastructure");
        amazon.setWebsite("https://amazon.jobs");
        amazon.setLocation("Chennai & Bangalore");
        companyRepository.save(amazon);

        User amazonRecruiterUser = new User();
        amazonRecruiterUser.setName("Vikramaditya Singhania");
        amazonRecruiterUser.setEmail("recruiter@amazon.com");
        amazonRecruiterUser.setPasswordHash(passwordEncoder.encode("amazon123"));
        amazonRecruiterUser.setRole(Role.RECRUITER);
        userRepository.save(amazonRecruiterUser);

        Recruiter amazonRecruiter = new Recruiter();
        amazonRecruiter.setUser(amazonRecruiterUser);
        amazonRecruiter.setCompany(amazon);
        recruiterRepository.save(amazonRecruiter);

        // TCS
        Company tcs = new Company();
        tcs.setName("Tata Consultancy Services");
        tcs.setDescription("A premier global IT services, consulting, and business solutions leader partnering with the world's greatest enterprises.");
        tcs.setIndustry("IT Services & Consulting");
        tcs.setWebsite("https://www.tcs.com/careers");
        tcs.setLocation("Chennai, Tamil Nadu");
        companyRepository.save(tcs);

        User tcsRecruiterUser = new User();
        tcsRecruiterUser.setName("Meera Nambiar");
        tcsRecruiterUser.setEmail("recruiter@tcs.com");
        tcsRecruiterUser.setPasswordHash(passwordEncoder.encode("tcs123"));
        tcsRecruiterUser.setRole(Role.RECRUITER);
        userRepository.save(tcsRecruiterUser);

        Recruiter tcsRecruiter = new Recruiter();
        tcsRecruiter.setUser(tcsRecruiterUser);
        tcsRecruiter.setCompany(tcs);
        recruiterRepository.save(tcsRecruiter);

        // ==========================================
        // 3. STUDENTS
        // ==========================================
        // Student 1: Aravind Swaminathan (High achiever, Full-stack)
        User aravindUser = new User();
        aravindUser.setName("Aravind Swaminathan");
        aravindUser.setEmail("aravind@srmist.edu.in");
        aravindUser.setPasswordHash(passwordEncoder.encode("student123"));
        aravindUser.setRole(Role.STUDENT);
        userRepository.save(aravindUser);

        Student aravind = new Student();
        aravind.setUser(aravindUser);
        aravind.setRegistrationNumber("RA2111003010142");
        aravind.setDepartment("Computer Science & Engineering");
        aravind.setDegree("B.Tech");
        aravind.setGraduationYear(2025);
        aravind.setCgpa(9.35);
        aravind.setTenthPercentage(95.4);
        aravind.setTwelfthPercentage(94.0);
        aravind.setBacklogs(0);
        aravind.setSkills("Java, Spring Boot, React, TypeScript, Docker, AWS, PostgreSQL, Microservices");
        aravind.setPhone("+91 91234 56780");
        aravind.setLinkedInUrl("https://linkedin.com/in/aravind-swaminathan-demo");
        aravind.setGithubUrl("https://github.com/aravind-demo");
        aravind.setResumePath("demo_resume_aravind.pdf");
        studentRepository.save(aravind);

        // Student 2: Sneha Reddy (AI/ML enthusiast)
        User snehaUser = new User();
        snehaUser.setName("Sneha Reddy");
        snehaUser.setEmail("sneha@srmist.edu.in");
        snehaUser.setPasswordHash(passwordEncoder.encode("student123"));
        snehaUser.setRole(Role.STUDENT);
        userRepository.save(snehaUser);

        Student sneha = new Student();
        sneha.setUser(snehaUser);
        sneha.setRegistrationNumber("RA2111003010215");
        sneha.setDepartment("Computer Science & Engineering (AI & ML)");
        sneha.setDegree("B.Tech");
        sneha.setGraduationYear(2025);
        sneha.setCgpa(8.85);
        sneha.setTenthPercentage(92.0);
        sneha.setTwelfthPercentage(90.5);
        sneha.setBacklogs(0);
        sneha.setSkills("Python, PyTorch, Scikit-Learn, NLP, Transformers, FastAPI, SQL, React");
        sneha.setPhone("+91 91234 56781");
        sneha.setLinkedInUrl("https://linkedin.com/in/sneha-reddy-demo");
        sneha.setGithubUrl("https://github.com/sneha-demo");
        sneha.setResumePath("demo_resume_sneha.pdf");
        studentRepository.save(sneha);

        // Student 3: Priya Sharma (Systems & DevOps, 9.65 CGPA Top Ranker)
        User priyaUser = new User();
        priyaUser.setName("Priya Sharma");
        priyaUser.setEmail("priya@srmist.edu.in");
        priyaUser.setPasswordHash(passwordEncoder.encode("student123"));
        priyaUser.setRole(Role.STUDENT);
        userRepository.save(priyaUser);

        Student priya = new Student();
        priya.setUser(priyaUser);
        priya.setRegistrationNumber("RA2111003010512");
        priya.setDepartment("Information Technology");
        priya.setDegree("B.Tech");
        priya.setGraduationYear(2025);
        priya.setCgpa(9.65);
        priya.setTenthPercentage(97.2);
        priya.setTwelfthPercentage(96.0);
        priya.setBacklogs(0);
        priya.setSkills("Go, Kubernetes, Distributed Systems, Redis, gRPC, React, System Design");
        priya.setPhone("+91 91234 56782");
        priya.setLinkedInUrl("https://linkedin.com/in/priya-sharma-demo");
        priya.setGithubUrl("https://github.com/priya-demo");
        priya.setResumePath("demo_resume_priya.pdf");
        studentRepository.save(priya);

        // Student 4: Rohit Verma (Electronics & Embedded, 1 backlog)
        User rohitUser = new User();
        rohitUser.setName("Rohit Verma");
        rohitUser.setEmail("rohit@srmist.edu.in");
        rohitUser.setPasswordHash(passwordEncoder.encode("student123"));
        rohitUser.setRole(Role.STUDENT);
        userRepository.save(rohitUser);

        Student rohit = new Student();
        rohit.setUser(rohitUser);
        rohit.setRegistrationNumber("RA2111003020088");
        rohit.setDepartment("Electronics & Communication Engineering");
        rohit.setDegree("B.Tech");
        rohit.setGraduationYear(2025);
        rohit.setCgpa(7.45);
        rohit.setTenthPercentage(84.0);
        rohit.setTwelfthPercentage(81.5);
        rohit.setBacklogs(1);
        rohit.setSkills("C, C++, Embedded Linux, RTOS, IoT, Python, MATLAB");
        rohit.setPhone("+91 91234 56783");
        rohit.setLinkedInUrl("https://linkedin.com/in/rohit-verma-demo");
        rohit.setGithubUrl("https://github.com/rohit-demo");
        studentRepository.save(rohit);

        // ==========================================
        // 4. PLACEMENT JOBS
        // ==========================================
        Job googleJob = new Job();
        googleJob.setCompany(google);
        googleJob.setTitle("Software Engineer - University Graduate 2025");
        googleJob.setDescription("Join Google's Core Engineering organization to develop large-scale distributed software, AI services, and global cloud systems reaching billions of users worldwide.");
        googleJob.setRequiredSkills("Strong problem-solving skills, data structures & algorithms proficiency, solid fundamentals in OS, Computer Networks, and DBMS. Hands-on coding experience in Java, C++, or Python.");
        googleJob.setLocation("Bangalore, Karnataka");
        googleJob.setJobType(JobType.FULL_TIME);
        googleJob.setPackageLpa(28.5);
        googleJob.setMinimumCgpa(8.5);
        googleJob.setEligibleDepartments("Computer Science & Engineering, Information Technology, Computer Science & Engineering (AI & ML)");
        googleJob.setGraduationYear(2025);
        googleJob.setMaximumBacklogs(0);
        googleJob.setMinimumTenthPercentage(80.0);
        googleJob.setMinimumTwelfthPercentage(80.0);
        googleJob.setDeadline(LocalDate.now().plusDays(25));
        googleJob.setStatus(JobStatus.OPEN);
        jobRepository.save(googleJob);

        Job msftJob = new Job();
        msftJob.setCompany(microsoft);
        msftJob.setTitle("Software Development Engineer (SDE 1)");
        msftJob.setDescription("Build the next generation of cloud and productivity solutions within Microsoft Cloud & AI. You will write robust, high-performance code and ship features directly to enterprise clients.");
        msftJob.setRequiredSkills("Proficiency in object-oriented programming (C#, Java, or C++), solid grasp of algorithms, cloud-native architecture principles, and web technologies.");
        msftJob.setLocation("Hyderabad, Telangana");
        msftJob.setJobType(JobType.FULL_TIME);
        msftJob.setPackageLpa(24.0);
        msftJob.setMinimumCgpa(8.0);
        msftJob.setEligibleDepartments("Computer Science & Engineering, Information Technology, Electronics & Communication Engineering, Computer Science & Engineering (AI & ML)");
        msftJob.setGraduationYear(2025);
        msftJob.setMaximumBacklogs(0);
        msftJob.setMinimumTenthPercentage(75.0);
        msftJob.setMinimumTwelfthPercentage(75.0);
        msftJob.setDeadline(LocalDate.now().plusDays(18));
        msftJob.setStatus(JobStatus.OPEN);
        jobRepository.save(msftJob);

        Job amazonJob = new Job();
        amazonJob.setCompany(amazon);
        amazonJob.setTitle("Cloud Support Associate - AWS Infrastructure");
        amazonJob.setDescription("Dive deep into Amazon Web Services architecture, helping global enterprises optimize distributed microservices, serverless compute, and multi-region databases.");
        amazonJob.setRequiredSkills("Understanding of Linux systems, networking protocols (TCP/IP, DNS, SSL), distributed database concepts, scripting in Python or Bash, and passion for cloud computing.");
        amazonJob.setLocation("Chennai, Tamil Nadu");
        amazonJob.setJobType(JobType.FULL_TIME);
        amazonJob.setPackageLpa(18.0);
        amazonJob.setMinimumCgpa(7.5);
        amazonJob.setEligibleDepartments("Computer Science & Engineering, Information Technology, Electronics & Communication Engineering, Computer Science & Engineering (AI & ML)");
        amazonJob.setGraduationYear(2025);
        amazonJob.setMaximumBacklogs(1);
        amazonJob.setMinimumTenthPercentage(70.0);
        amazonJob.setMinimumTwelfthPercentage(70.0);
        amazonJob.setDeadline(LocalDate.now().plusDays(12));
        amazonJob.setStatus(JobStatus.OPEN);
        jobRepository.save(amazonJob);

        Job tcsJob = new Job();
        tcsJob.setCompany(tcs);
        tcsJob.setTitle("Digital Systems Engineer (TCS Digital)");
        tcsJob.setDescription("Accelerate enterprise digital transformations across AI/ML, Cloud migration, cybersecurity, and IoT platforms with global customers.");
        tcsJob.setRequiredSkills("Good analytical and programming aptitude. Open to all engineering branches with strong problem-solving fundamentals.");
        tcsJob.setLocation("Pan India (Chennai / Bangalore / Pune / Hyderabad)");
        tcsJob.setJobType(JobType.FULL_TIME);
        tcsJob.setPackageLpa(7.5);
        tcsJob.setMinimumCgpa(7.0);
        tcsJob.setEligibleDepartments("Computer Science & Engineering, Information Technology, Electronics & Communication Engineering, Computer Science & Engineering (AI & ML), Mechanical Engineering");
        tcsJob.setGraduationYear(2025);
        tcsJob.setMaximumBacklogs(1);
        tcsJob.setMinimumTenthPercentage(65.0);
        tcsJob.setMinimumTwelfthPercentage(65.0);
        tcsJob.setDeadline(LocalDate.now().plusDays(30));
        tcsJob.setStatus(JobStatus.OPEN);
        jobRepository.save(tcsJob);

        // ==========================================
        // 5. APPLICATIONS
        // ==========================================
        // Aravind -> Applied to Google (SHORTLISTED)
        JobApplication app1 = new JobApplication();
        app1.setStudent(aravind);
        app1.setJob(googleJob);
        app1.setStatus(ApplicationStatus.SHORTLISTED);
        app1.setApplicationDate(LocalDateTime.now().minusDays(5));
        applicationRepository.save(app1);

        // Aravind -> Applied to Microsoft (INTERVIEW_SCHEDULED)
        JobApplication app2 = new JobApplication();
        app2.setStudent(aravind);
        app2.setJob(msftJob);
        app2.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        app2.setApplicationDate(LocalDateTime.now().minusDays(4));
        applicationRepository.save(app2);

        // Priya -> Applied to Google (SELECTED 🎉)
        JobApplication app3 = new JobApplication();
        app3.setStudent(priya);
        app3.setJob(googleJob);
        app3.setStatus(ApplicationStatus.SELECTED);
        app3.setApplicationDate(LocalDateTime.now().minusDays(8));
        applicationRepository.save(app3);

        // Sneha -> Applied to Microsoft (SHORTLISTED)
        JobApplication app4 = new JobApplication();
        app4.setStudent(sneha);
        app4.setJob(msftJob);
        app4.setStatus(ApplicationStatus.SHORTLISTED);
        app4.setApplicationDate(LocalDateTime.now().minusDays(3));
        applicationRepository.save(app4);

        // Rohit -> Applied to Amazon (APPLIED)
        JobApplication app5 = new JobApplication();
        app5.setStudent(rohit);
        app5.setJob(amazonJob);
        app5.setStatus(ApplicationStatus.APPLIED);
        app5.setApplicationDate(LocalDateTime.now().minusDays(1));
        applicationRepository.save(app5);

        // Sneha -> Applied to TCS (SELECTED 🎉)
        JobApplication app6 = new JobApplication();
        app6.setStudent(sneha);
        app6.setJob(tcsJob);
        app6.setStatus(ApplicationStatus.SELECTED);
        app6.setApplicationDate(LocalDateTime.now().minusDays(7));
        applicationRepository.save(app6);

        // ==========================================
        // 6. SCHEDULED INTERVIEWS
        // ==========================================
        Interview int1 = new Interview();
        int1.setApplication(app2); // Aravind -> Microsoft
        int1.setScheduledAt(LocalDateTime.now().plusDays(2).withHour(14).withMinute(0));
        int1.setMode("ONLINE");
        int1.setLocationOrMeetingLink("https://teams.microsoft.com/l/meetup-join/srm-placement-msft-sde1");
        int1.setNotes("Round 1: Data Structures & Algorithms. Interviewer: Deepak Sharma (Microsoft Principal Engineer)");
        interviewRepository.save(int1);

        Interview int2 = new Interview();
        int2.setApplication(app1); // Aravind -> Google
        int2.setScheduledAt(LocalDateTime.now().plusDays(3).withHour(16).withMinute(30));
        int2.setMode("ONLINE");
        int2.setLocationOrMeetingLink("https://meet.google.com/xyz-plcm-srm");
        int2.setNotes("Technical Screening: Problem Solving. Interviewer: Pooja Nair (Google Staff SRE)");
        interviewRepository.save(int2);

        // ==========================================
        // 7. NOTIFICATIONS
        // ==========================================
        Notification notif1 = new Notification(aravindUser,
                "Interview Scheduled: Microsoft SDE 1",
                "Your Round 1 interview is scheduled for " + LocalDate.now().plusDays(2) + " at 2:00 PM on Microsoft Teams.");
        notificationRepository.save(notif1);

        Notification notif2 = new Notification(aravindUser,
                "Application Shortlisted: Google",
                "Congratulations! Your application for Software Engineer at Google has been shortlisted by the recruiter.");
        notif2.setRead(true);
        notificationRepository.save(notif2);

        Notification notif3 = new Notification(priyaUser,
                "🎉 Placement Offer Received: Google!",
                "Congratulations Priya! Google has extended an official campus placement offer for ₹28.5 LPA. Check your email for paperwork.");
        notificationRepository.save(notif3);

        Notification notif4 = new Notification(officerUser,
                "Placement Drive Update",
                "Google and Microsoft have released initial shortlists. 2 student offers rolled out with highest CTC ₹28.5 LPA.");
        notificationRepository.save(notif4);

        System.out.println("✅ PLACAMATE database seed complete! 4 companies, 4 students, 4 jobs, 6 applications, 2 interviews, 4 notifications created.");
    }
}
