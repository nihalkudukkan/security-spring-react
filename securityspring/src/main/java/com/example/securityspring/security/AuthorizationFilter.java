package com.example.securityspring.security;

import com.example.securityspring.model.Account;
import com.example.securityspring.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@AllArgsConstructor
@Slf4j
public class AuthorizationFilter extends OncePerRequestFilter {

    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getServletPath().contains("/public") || request.getServletPath().equals("/")) {
            filterChain.doFilter(request, response);
            return;
        }
        try {
            String jwt = request.getHeader("Authorization").substring(7);
            Account user = jwtUtil.getUser(jwt);
            UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(token);
        } catch (Exception e) {
            log.error(e.getMessage());
            SecurityContextHolder.clearContext();
        }
        filterChain.doFilter(request, response);

    }
}
