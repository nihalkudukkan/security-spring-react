package com.example.securityspring.controller;

import com.example.securityspring.model.Account;
import com.example.securityspring.model.Asset;
import com.example.securityspring.model.response.ErrorResponse;
import com.example.securityspring.repository.AccountRepository;
import com.example.securityspring.repository.AssetRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/public")
@AllArgsConstructor
public class PublicController {

    private AccountRepository accountRepository;
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    private AssetRepository assetRepository;

    @GetMapping("/get")
    public String get() {
        return "public";
    }

    @PostMapping("/adduser")
    public ResponseEntity<?> addUser(@RequestBody Account account) {
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            return new ResponseEntity<>(new ErrorResponse("User already present", 400), HttpStatus.FORBIDDEN);
        }
        account.setPassword(bCryptPasswordEncoder.encode(account.getPassword()));
        account.setRole("USER");
        return new ResponseEntity<>(accountRepository.save(account), HttpStatus.CREATED);
    }

    @GetMapping("/allassets")
    public List<Asset> getAllAsset() {
        return assetRepository.findAll();
    }

}
