package com.example.securityspring.security;

import com.example.securityspring.model.Account;
import com.example.securityspring.model.response.TokenResponse;
import com.example.securityspring.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@AllArgsConstructor
@Slf4j
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private AuthenticationManager authenticationManager;
    private JwtUtil jwtUtil;
    private ObjectMapper objectMapper;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        Account credential = new Account();
        try {
            credential = objectMapper.readValue(request.getInputStream(), Account.class);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        UsernamePasswordAuthenticationToken token
                = new UsernamePasswordAuthenticationToken(credential.getUsername(),credential.getPassword());
        return authenticationManager.authenticate(token);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {
        Account user = (Account) authResult.getPrincipal();
        String token = "Bearer " + jwtUtil.generateToken(user);
        TokenResponse authResponse = new TokenResponse(token, user.getRole(), user);
        response.setContentType("application/json");
        objectMapper.writeValue(response.getOutputStream(), authResponse);
    }
}
