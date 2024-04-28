package com.sentinel.idps.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;

@Entity
public class Attacks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String attackerUsername;
    private LocalDateTime timestamp;
    private String attackerIpAddress;
    private String attackerLocation;
    private String attackType;
    private String targetedResource;
    private String severityLevel;
    private String status;
    private String description;

    private String applicationName;

    public Attacks() {}

    public Attacks(String applicationName, LocalDateTime timestamp, String attackerIpAddress, String attackerUsername, String attackerLocation, String attackType, String targetedResource, String severityLevel, String status, String description, String attackVector, String affectedUser, String actionsTaken) {
        this.applicationName = applicationName;
        this.timestamp = timestamp;
        this.attackerIpAddress = attackerIpAddress;
        this.attackerUsername = attackerUsername;
        this.attackerLocation = attackerLocation;
        this.attackType = attackType;
        this.targetedResource = targetedResource;
        this.severityLevel = severityLevel;
        this.status = status;
        this.description = description;
    }

    public String getApplicationName() {
        return applicationName;
    }

    public void setApplicationName(String applicationName) {
        this.applicationName = applicationName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getAttackerIpAddress() {
        return attackerIpAddress;
    }

    public void setAttackerIpAddress(String attackerIpAddress) {
        this.attackerIpAddress = attackerIpAddress;
    }

    public String getAttackerUsername() {
        return attackerUsername;
    }

    public void setAttackerUsername(String attackerUsername) {
        this.attackerUsername = attackerUsername;
    }

    public String getAttackerLocation() {
        return attackerLocation;
    }

    public void setAttackerLocation(String attackerLocation) {
        this.attackerLocation = attackerLocation;
    }

    public String getAttackType() {
        return attackType;
    }

    public void setAttackType(String attackType) {
        this.attackType = attackType;
    }

    public String getTargetedResource() {
        return targetedResource;
    }

    public void setTargetedResource(String targetedResource) {
        this.targetedResource = targetedResource;
    }

    public String getSeverityLevel() {
        return severityLevel;
    }

    public void setSeverityLevel(String severityLevel) {
        this.severityLevel = severityLevel;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Attacks{" +
                "id=" + id +
                ", timestamp=" + timestamp +
                ", attackerIpAddress='" + attackerIpAddress + '\'' +
                ", attackerUsername='" + attackerUsername + '\'' +
                ", attackerLocation='" + attackerLocation + '\'' +
                ", attackType='" + attackType + '\'' +
                ", targetedResource='" + targetedResource + '\'' +
                ", severityLevel='" + severityLevel + '\'' +
                ", status='" + status + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
