package com.example.securityspring.security;

import com.example.securityspring.repository.AccountRepository;
import com.example.securityspring.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@AllArgsConstructor
public class SecurityConfig {

    private JwtUtil jwtUtil;
    private ObjectMapper objectMapper;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private AccountRepository accountRepository;
    private AuthorizationFilter authorizationFilter;

    @Autowired
    public void provider(AuthenticationManagerBuilder authBuilder) throws Exception {
        authBuilder.userDetailsService(username ->accountRepository.findByUsername(username)
                .orElseThrow(()-> new UsernameNotFoundException("User not found")))
                .passwordEncoder(bCryptPasswordEncoder);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthenticationManager authenticationManager) throws Exception {
        AuthenticationFilter authenticationFilter = new AuthenticationFilter(authenticationManager, jwtUtil, objectMapper);
        authenticationFilter.setFilterProcessesUrl("/public/login");
        http
                .cors(x->
                        x.configurationSource(req->{
                            CorsConfiguration config = new CorsConfiguration();
                            config.addAllowedOrigin("*");
                            config.addAllowedMethod("*");
                            config.addAllowedHeader("*");
                            return config;
                        }))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(x->x.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/public/**","/").permitAll()
                        .requestMatchers("/user/**").hasAnyAuthority("USER")
                        .requestMatchers("/admin/**").hasAnyAuthority("ADMIN")
                        .anyRequest().authenticated()
                );
        http.addFilterAfter(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

}
