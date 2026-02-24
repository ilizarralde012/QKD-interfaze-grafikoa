package com.example.demo.controller_PL;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    // HTML orriak zerbitzatu

    @GetMapping("/")
    public String index() {
        return "index";  // → resources/templates/index.html
    }

    @GetMapping("/apps")
    public String apps() {
        return "apps";   // → resources/templates/apps.html
    }

    @GetMapping("/requests")
    public String requests() {
        return "requests";  // → resources/templates/requests.html
    }
}