package com.example.securityspring.controller;

import com.example.securityspring.model.Account;
import com.example.securityspring.model.Asset;
import com.example.securityspring.model.response.TokenResponse;
import com.example.securityspring.repository.AssetRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@Slf4j
public class AuthController {

    private AssetRepository assetRepository;

    @GetMapping("/verifytoken")
    public ResponseEntity<?> verifyToken() {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        TokenResponse response = new TokenResponse(null, account.getRole(), account);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/asset/{id}")
    public Asset getAssetWithId(@PathVariable int id) {
        return assetRepository.findById(id).orElse(null);
    }

    @PutMapping("/asset/{id}")
    public ResponseEntity<?> editAsset(@PathVariable(value = "id") int id, @RequestBody Asset asset) {
        Account user = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (asset.getAssetId()!=id) {
            return ResponseEntity.notFound().build();
        }
        if (!assetRepository.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Asset saved = assetRepository.save(asset);
        log.info("Asset {} edited by account {}", asset.getAssetId(), user.getUsername());
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @DeleteMapping("/asset/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable(value = "id") int id) {
        Account account = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Asset asset = assetRepository.findById(id).orElse(null);
        if (asset==null) {
            return ResponseEntity.notFound().build();
        }
        assetRepository.deleteById(id);
        log.info("Asset {} deleted by account {}", asset.getAssetId(), account.getUsername());
        return new ResponseEntity<List<Asset>>(assetRepository.findAll(), HttpStatus.OK);
    }
}
