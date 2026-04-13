package com.example.demo.controller_PL;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomLoginController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/perform-login")
    public String performLogin(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            @RequestParam(value = "login_type", required = false) String loginType,
            HttpServletRequest request
    ) {
        try {
            // Autentikazio token sortu
            UsernamePasswordAuthenticationToken authRequest = 
                new UsernamePasswordAuthenticationToken(username, password);

            // Autentikatu (LDAP lehenik, Database gero)
            Authentication authResult = authenticationManager.authenticate(authRequest);

            // Sesioan gorde
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authResult);
            SecurityContextHolder.setContext(securityContext);
            
            // HTTP sesioan gorde
            request.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, 
                securityContext
            );

            // Arrakasta → joan hasierara
            return "redirect:/";

        } catch (AuthenticationException e) {
            // Errorea → itzuli login-era tipo-arekin
            if (loginType != null && !loginType.isEmpty()) {
                return "redirect:/login?error=true&type=" + loginType;
            } else {
                return "redirect:/login?error=true";
            }
        }
    }
}