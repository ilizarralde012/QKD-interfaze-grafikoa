package com.example.demo.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordEncoderUtil {
    
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        
        String rawPassword = "test123";
        String encodedPassword = encoder.encode(rawPassword);
        
        System.out.println("=========================================");
        System.out.println("Raw password: " + rawPassword);
        System.out.println("Encoded password: " + encodedPassword);
        System.out.println("Length: " + encodedPassword.length());
        System.out.println("=========================================");
        System.out.println("\n📋 KOPIATU SQL KOMANDO HAU:\n");
        System.out.println("USE mydb;");
        System.out.println("DELETE FROM users;");
        System.out.println("INSERT INTO users (username, password, enabled) VALUES ('testuser', '" + encodedPassword + "', 1);");
        System.out.println("INSERT INTO users (username, password, enabled) VALUES ('demo', '" + encodedPassword + "', 1);");
        System.out.println("SELECT username, LENGTH(password) as len, enabled FROM users;");
        System.out.println("\n=========================================");
    }
}