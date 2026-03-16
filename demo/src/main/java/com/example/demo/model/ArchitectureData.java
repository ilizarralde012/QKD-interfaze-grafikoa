package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Architecture.json fitxategiaren egitura
 */
public class ArchitectureData {
    
    private List<Node> nodes;
    private List<Link> links;
    
    public static class Node {
        private String id;
        
        @JsonProperty("node_type")
        private String nodeType;
        
        private String site;
        
        @JsonProperty("has_kms")
        private Boolean hasKms;
        
        @JsonProperty("kms_ids")
        private List<String> kmsIds;
        
        @JsonProperty("vkms_id")
        private String vkmsId;
        
        private Double x;
        private Double y;
        
        // Getters y setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        
        public String getNodeType() { return nodeType; }
        public void setNodeType(String nodeType) { this.nodeType = nodeType; }
        
        public String getSite() { return site; }
        public void setSite(String site) { this.site = site; }
        
        public Boolean getHasKms() { return hasKms; }
        public void setHasKms(Boolean hasKms) { this.hasKms = hasKms; }
        
        public List<String> getKmsIds() { return kmsIds; }
        public void setKmsIds(List<String> kmsIds) { this.kmsIds = kmsIds; }
        
        public String getVkmsId() { return vkmsId; }
        public void setVkmsId(String vkmsId) { this.vkmsId = vkmsId; }
        
        public Double getX() { return x; }
        public void setX(Double x) { this.x = x; }
        
        public Double getY() { return y; }
        public void setY(Double y) { this.y = y; }
    }
    
    public static class Link {
        private String source;
        private String target;
        
        @JsonProperty("link_type")
        private String linkType;
        
        // Getters y setters
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        
        public String getTarget() { return target; }
        public void setTarget(String target) { this.target = target; }
        
        public String getLinkType() { return linkType; }
        public void setLinkType(String linkType) { this.linkType = linkType; }
    }
    
    // Getters y setters
    public List<Node> getNodes() { return nodes; }
    public void setNodes(List<Node> nodes) { this.nodes = nodes; }
    
    public List<Link> getLinks() { return links; }
    public void setLinks(List<Link> links) { this.links = links; }
}