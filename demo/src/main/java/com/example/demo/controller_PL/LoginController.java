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
        @RequestParam(value = "type", required = false) String type,
        Model model
    ) {
        if (error != null) {
            model.addAttribute("error", true);
        }
        if (logout != null) {
            model.addAttribute("logout", true);
        }
        
        // Zein login mota erakutsi
        if ("ldap".equals(type)) {
            model.addAttribute("loginType", "ldap");
        } else if ("db".equals(type)) {
            model.addAttribute("loginType", "db");
        } else {
            model.addAttribute("showSelection", true);
        }
        
        return "login";
    }
}