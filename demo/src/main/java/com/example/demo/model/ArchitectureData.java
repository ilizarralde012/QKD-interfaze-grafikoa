package com.example.demo.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Architecture.json fitxategiaren egitura
 */
public class ArchitectureData {
    
    private List<Node> nodes;
    private List<Link> links;
    
    @JsonProperty("classical-links")
    private List<Link> classicalLinks;
    
    public static class Node {
        private String id;
        
        @JsonProperty("node_type")
        private String nodeType;
        
        private String site;
        
        @JsonProperty("vKMS")
        private String vkms;
        
        @JsonProperty("vkms_address")
        private String vkmsAddress;
        
        private String address;
        
        
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getNodeType() { return nodeType; }
        public void setNodeType(String nodeType) { this.nodeType = nodeType; }
        
        public String getSite() { return site; }
        public void setSite(String site) { this.site = site; }
        
        public String getVkms() { return vkms; }
        public void setVkms(String vkms) { this.vkms = vkms; }
        
        public String getVkmsAddress() { return vkmsAddress; }
        public void setVkmsAddress(String vkmsAddress) { this.vkmsAddress = vkmsAddress; }
        
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }
    
    public static class Link {
        private String source;
        private String target;
        
        @JsonProperty("quantum_link")
        private Boolean quantumLink;
        
        // Getters y setters
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        
        public String getTarget() { return target; }
        public void setTarget(String target) { this.target = target; }
        
        public Boolean getQuantumLink() { return quantumLink; }
        public void setQuantumLink(Boolean quantumLink) { this.quantumLink = quantumLink; }
    }
    
    // Getters y setters
    public List<Node> getNodes() { return nodes; }
    public void setNodes(List<Node> nodes) { this.nodes = nodes; }
    
    public List<Link> getLinks() { return links; }
    public void setLinks(List<Link> links) { this.links = links; }
    
    public List<Link> getClassicalLinks() { return classicalLinks; }
    public void setClassicalLinks(List<Link> classicalLinks) { this.classicalLinks = classicalLinks; }
}