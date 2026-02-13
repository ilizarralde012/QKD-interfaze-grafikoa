package com.example.demo.entity_DL;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "APP")
public class AppE {
    @Id
    @Column(length = 10)
    private String id;

    @Column(name = "site_id", length = 10)
    private String siteId;

    @Column(name = "vkms_id", length = 10)
    private String vkmsId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public String getVkmsId() {
        return vkmsId;
    }

    public void setVkmsId(String vkmsId) {
        this.vkmsId = vkmsId;
    }

}
