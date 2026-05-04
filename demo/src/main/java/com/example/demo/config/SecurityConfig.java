package com.example.demo.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${spring.ldap.urls}")
    private String ldapUrl;

    @Value("${spring.ldap.base}")
    private String ldapBase;

    @Value("${ldap.user.search.filter}")
    private String userSearchFilter;

    private final UserDetailsService databaseUserDetailsService;

    public SecurityConfig(@Qualifier("databaseUserDetailsService") UserDetailsService databaseUserDetailsService) {
        this.databaseUserDetailsService = databaseUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/login", "/css/**", "/js/**", "/images/**", "/error", "/favicon.ico").permitAll()
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")  
                .usernameParameter("username")
                .passwordParameter("password")
                .defaultSuccessUrl("/", true)
                .failureHandler((request, response, exception) -> {
                    // Log egin errorea
                    System.err.println("=== AUTHENTICATION FAILURE ===");
                    System.err.println("Exception: " + exception.getClass().getName());
                    System.err.println("Message: " + exception.getMessage());
                    if (exception.getCause() != null) {
                        System.err.println("Cause: " + exception.getCause().getMessage());
                    }
                    exception.printStackTrace();
                    
                    // Birbideratu login-era
                    response.sendRedirect("/login?error=true");
                })
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .clearAuthentication(true)
                .permitAll()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
                .maxSessionsPreventsLogin(false)
            )
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) -> 
                    response.sendRedirect("/login")
                )
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/**")
            )
            // GAKOA: Gehitu AuthenticationManager-a HTTP security-ra
            .authenticationManager(authenticationManager());

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(
            Arrays.asList(
                daoAuthenticationProvider(),
                ldapAuthenticationProvider()                
            )
        );
    }

    @Bean
    public LdapAuthenticationProvider ldapAuthenticationProvider() {
        BindAuthenticator bindAuthenticator = new BindAuthenticator(contextSource());
        bindAuthenticator.setUserSearch(
            new FilterBasedLdapUserSearch("", userSearchFilter, contextSource())
        );
        
        return new LdapAuthenticationProvider(bindAuthenticator);
    }

   @Bean
public DaoAuthenticationProvider daoAuthenticationProvider() {
    DaoAuthenticationProvider provider = new DaoAuthenticationProvider(databaseUserDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
}

    @Bean
    public DefaultSpringSecurityContextSource contextSource() {
        DefaultSpringSecurityContextSource contextSource = 
        new DefaultSpringSecurityContextSource(ldapUrl + "/" + ldapBase);
    
    // Timeout konfigurazioa (VPN-rik ez badago azkarrago huts egiteko)
    java.util.Hashtable<String, Object> baseEnv = new java.util.Hashtable<>();
    baseEnv.put("com.sun.jndi.ldap.connect.timeout", "3000");  // 3 segundo
    baseEnv.put("com.sun.jndi.ldap.read.timeout", "3000");     // 3 segundo
    contextSource.setBaseEnvironmentProperties(baseEnv);
    
    return contextSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}