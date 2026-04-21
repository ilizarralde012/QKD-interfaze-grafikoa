package com.example.demo.controller_PL;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    @GetMapping("/login")
    public String loginPage(
        @RequestParam(value = "error", required = false) String error,
        @RequestParam(value = "logout", required = false) String logout,
        Model model
    ) {
        if (error != null) {
            model.addAttribute("error", true);
            model.addAttribute("errorMessage", "Erabiltzaile izena edo pasahitza ez dira zuzenak.");
        }
        if (logout != null) {
            model.addAttribute("logout", true);
            model.addAttribute("logoutMessage", "Saioa ondo itxi duzu.");
        }
        
        return "login";
    }
}