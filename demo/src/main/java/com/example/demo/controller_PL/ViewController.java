package com.example.demo.controller_PL;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    // HTML orriak zerbitzatu

    @GetMapping("/")
    public String index() {
        return "index"; 
    }

    @GetMapping("/apps")
    public String apps() {
        return "apps";  
    }

    @GetMapping("/requests")
    public String requests() {
        return "requests";  
    }
}