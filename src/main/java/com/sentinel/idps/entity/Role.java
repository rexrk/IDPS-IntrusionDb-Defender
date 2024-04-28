package com.sentinel.idps.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
public class Role {
    @Id
    @GeneratedValue
    @JsonIgnoreProperties
    private Integer roleId;
    private String roleName;
    private String roleDescription;

    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "role_application",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "application_id")
    )
    @JsonIgnoreProperties("roles")
    private List<Application> applications;

    @ElementCollection
    @Enumerated(EnumType.STRING)
    private Set<Privilege> privileges;

    public Role() {
        applications = new ArrayList<>();
    }

    public Role(Integer roleId, String roleName, String roleDescription, List<Application> applications, Set<Privilege> privileges) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.applications = applications;
        this.privileges = privileges;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public List<Application> getApplications() {
        return applications;
    }

    public void setApplications(List<Application> applications) {
        this.applications = applications;
    }

    public Set<Privilege> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Set<Privilege> privileges) {
        this.privileges = privileges;
    }

    @Override
    public String toString() {
        return "Role{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", roleDescription='" + roleDescription + '\'' +
                ", applications=" + applications +
                ", privileges=" + privileges +
                '}';
    }
}
