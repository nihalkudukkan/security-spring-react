package com.example.securityspring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Controller {
    @GetMapping("/")
    public String get() {
        return "<h2>spring security<h2>";
    }
}
