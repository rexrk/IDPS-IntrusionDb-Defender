package com.sentinel.idps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Application {
    @Id
    @GeneratedValue
    private Integer applicationId;
    private String applicationName;
    private String applicationDescription;
    private String applicationVersion;

    @ManyToMany(mappedBy = "applications", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("applications")
    private List<Role> roles;

    public Application(Integer applicationId, String applicationName, String applicationDescription, String applicationVersion, List<Role> roles) {
        this.applicationId = applicationId;
        this.applicationName = applicationName;
        this.applicationDescription = applicationDescription;
        this.applicationVersion = applicationVersion;
        this.roles = roles;
    }

    public Application() {
        roles = new ArrayList<Role>();
    }

    public Integer getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Integer applicationId) {
        this.applicationId = applicationId;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public String getApplicationDescription() {
        return applicationDescription;
    }

    public void setApplicationDescription(String applicationDescription) {
        this.applicationDescription = applicationDescription;
    }

    public String getApplicationVersion() {
        return applicationVersion;
    }

    public void setApplicationVersion(String applicationVersion) {
        this.applicationVersion = applicationVersion;
    }

    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "Application{" +
                "applicationId=" + applicationId +
                ", applicationName='" + applicationName + '\'' +
                ", applicationDescription='" + applicationDescription + '\'' +
                ", applicationVersion='" + applicationVersion + '\'' +
                ", role=" + roles +
                '}';
    }
}

