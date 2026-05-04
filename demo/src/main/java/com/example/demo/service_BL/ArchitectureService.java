package com.example.demo.service_BL;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.example.demo.model.ArchitectureData;

import jakarta.annotation.PostConstruct;
import tools.jackson.databind.ObjectMapper;

@Service
public class ArchitectureService {
    
    private ArchitectureData architectureData;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Aplikazioa abiarazten denean, architecture.json kargatu
     */
    @PostConstruct
    public void loadArchitecture() {
        try {
            ClassPathResource resource = new ClassPathResource("static/data/architecture.json");
            InputStream inputStream = resource.getInputStream();
            architectureData = objectMapper.readValue(inputStream, ArchitectureData.class);
            System.out.println(" Architecture loaded: " + 
                architectureData.getNodes().size() + " nodes, " + 
                architectureData.getLinks().size() + " links");
        } catch (IOException e) {
            System.err.println(" Error loading architecture.json: " + e.getMessage());
            throw new RuntimeException("Failed to load architecture.json", e);
        }
    }
    
    /**
     * Architecture data osoa lortu
     */
    public ArchitectureData getArchitectureData() {
        return architectureData;
    }
    
    /**
     * Nodo bat ID-aren bidez lortu
     */
    public ArchitectureData.Node getNodeById(String nodeId) {
        return architectureData.getNodes().stream()
            .filter(node -> node.getId().equals(nodeId))
            .findFirst()
            .orElse(null);
    }
    
    /**
     * Site bateko KMS/vKMS guztiak lortu
     */
    public ArchitectureData.Node getNodeBySite(String siteId) {
        return architectureData.getNodes().stream()
            .filter(node -> siteId.equals(node.getSite()))
            .findFirst()
            .orElse(null);
    }
}