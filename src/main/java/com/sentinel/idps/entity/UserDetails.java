package com.sentinel.idps.entity;
import jakarta.persistence.*;

@Entity
public class UserDetails {
    @Id
    @GeneratedValue
    private Integer userId;
    private String username;
    private String password;
    private String ipAddress;
    private String sessionId;
    private String executingQuery;
    private String email;
    private String role;

    public UserDetails(Integer userId, String username, String password, String ipAddress, String sessionId, String executingQuery, String email, String role) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.ipAddress = ipAddress;
        this.sessionId = sessionId;
        this.executingQuery = executingQuery;
        this.email = email;
        this.role = role;
    }

    public UserDetails() {
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getExecutingQuery() {
        return executingQuery;
    }

    public void setExecutingQuery(String executingQuery) {
        this.executingQuery = executingQuery;
    }

    @Override
    public String toString() {
        return "UserDetails{" +
                "userId=" + userId +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", executingQuery='" + executingQuery + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }
}

