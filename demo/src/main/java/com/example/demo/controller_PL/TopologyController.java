package com.example.demo.controller_PL;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TopologyController {

    @GetMapping("/")
    public String index() {
        // Busca un archivo llamado index.html en src/main/resources/templates
        return "index";
    }
}