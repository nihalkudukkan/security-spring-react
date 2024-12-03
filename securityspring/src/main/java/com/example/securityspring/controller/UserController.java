package com.example.securityspring.controller;

import com.example.securityspring.model.Account;
import com.example.securityspring.model.Asset;
import com.example.securityspring.repository.AssetRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
@Slf4j
public class UserController {

    private AssetRepository assetRepository;
    @GetMapping("/get")
    public String get() {
        return "public";
    }

    @PostMapping("/addasset")
    public Asset addAsset(@RequestBody Asset asset) {
        Account user = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        asset.setAccount(user);
        Asset saved = assetRepository.save(asset);
        log.info("Saved asset {}", saved.getName());
        return saved;
    }

    @GetMapping("/asset/{id}")
    public Asset getAssetWithId(@PathVariable int id) {
        return assetRepository.findById(id).orElse(null);
    }
}
