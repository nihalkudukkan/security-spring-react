package com.example.securityspring.util;

import com.example.securityspring.model.Account;
import com.example.securityspring.repository.AccountRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@AllArgsConstructor
public class JwtUtil {

    private final String secret = "c2VjdXJpdHlzZWNyZXQ=";

    private AccountRepository accountRepository;

    public String generateToken(Account user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("role", user.getAuthorities())
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
    }

    public Account getUser(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody();

        String username = claims.getSubject();
        return accountRepository.findByUsername(username).get();
    }

}
