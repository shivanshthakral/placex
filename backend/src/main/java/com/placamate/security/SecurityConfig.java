package com.placamate.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disabled for simplicity in academic demo with session auth
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/jobs", "/api/jobs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/students/*/resume").hasAnyRole("STUDENT", "RECRUITER", "PLACEMENT_OFFICER")
                .requestMatchers("/api/students/**").hasRole("STUDENT")
                .requestMatchers("/api/applications/me").hasRole("STUDENT")
                .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("STUDENT")
                .requestMatchers("/api/recruiter/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PUT, "/api/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PATCH, "/api/jobs/**").hasRole("RECRUITER")
                .requestMatchers(HttpMethod.PATCH, "/api/applications/*/status").hasAnyRole("RECRUITER", "PLACEMENT_OFFICER")
                .requestMatchers("/api/interviews/**").hasAnyRole("RECRUITER", "PLACEMENT_OFFICER")
                .requestMatchers("/api/admin/**").hasRole("PLACEMENT_OFFICER")
                .requestMatchers("/api/notifications/**").authenticated()
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                })
                .accessDeniedHandler((req, res, e) -> {
                    res.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    res.setContentType("application/json");
                    res.getWriter().write("{\"status\":403,\"error\":\"Forbidden\",\"message\":\"Access denied\"}");
                })
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())); // For H2 console

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
