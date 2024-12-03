package com.example.securityspring;

import com.example.securityspring.model.Account;
import com.example.securityspring.repository.AccountRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SecurityspringApplication {

	@Autowired
	AccountRepository accountRepository;

	@Bean
	public ObjectMapper objectMapper() {
		return new ObjectMapper();
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	public static void main(String[] args) {
		SpringApplication.run(SecurityspringApplication.class, args);
	}

	@PostConstruct
	public void addAdmin() {
		if (accountRepository.findByUsername("ADMIN").isEmpty()) {
			Account account = new Account();
			account.setUsername("admin");
			account.setPassword(new BCryptPasswordEncoder().encode("admin"));
			account.setRole("ADMIN");
			accountRepository.save(account);
		}
	}

}
