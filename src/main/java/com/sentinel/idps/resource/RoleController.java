package com.sentinel.idps.resource;
import com.sentinel.idps.entity.Application;
import com.sentinel.idps.entity.Role;
import com.sentinel.idps.repository.AppRepository;
import com.sentinel.idps.repository.RoleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class RoleController {
    private final RoleRepository roleRepository;
    private final AppRepository appRepository;

    public RoleController(RoleRepository roleRepository, AppRepository appRepository) {
        this.roleRepository = roleRepository;
        this.appRepository = appRepository;
    }

    private Application getApplication(Integer id) {
        return appRepository.findById(id).orElse(null);
    }

    @PostMapping("/{id}/roles")
    public ResponseEntity<Role> addRoleToApplication(@PathVariable Integer id, @RequestBody Role role) {
        Application application = getApplication(id);
        if (application == null)  return ResponseEntity.notFound().build();

        role.getApplications().add(application);
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(savedRole);
    }

    @GetMapping("/{id}/roles")
    public ResponseEntity<List<Role>> getAllRolesForApplication(@PathVariable Integer id) {
        Application application = getApplication(id);
        if (application == null) return ResponseEntity.notFound().build();
        List<Role> roles = application.getRoles();
        return ResponseEntity.ok(roles);
    }

    @GetMapping("{id}/roles/{roleId}")
    public ResponseEntity<Role> getRoleById(@PathVariable Integer id, @PathVariable Integer roleId) {
        Application application = getApplication(id);
        if (application == null) return ResponseEntity.notFound().build();

        Role role = roleRepository.findById(roleId).orElse(null);
        if (role == null) return ResponseEntity.notFound().build();

        return ResponseEntity.ok(role);
    }

    @PutMapping("{id}/roles/{roleId}")
    public ResponseEntity<Role> updateRole(@PathVariable Integer id, @PathVariable Integer roleId, @RequestBody Role updatedRole) {
        Application application = getApplication(id);
        if (application == null) return ResponseEntity.notFound().build();

        Role role = roleRepository.findById(roleId).orElse(null);
        if (role == null) return ResponseEntity.notFound().build();

        // Update role properties
        role.setRoleName(updatedRole.getRoleName());
        role.setRoleDescription(updatedRole.getRoleDescription());
        role.setPrivileges(updatedRole.getPrivileges());

        // Save the updated role
        Role savedRole = roleRepository.save(role);
        return ResponseEntity.ok(savedRole);
    }

    @DeleteMapping("{id}/roles/{roleId}")
    public ResponseEntity<Void> deleteRole(@PathVariable Integer id, @PathVariable Integer roleId) {
        Application application = getApplication(id);
        if (application == null) return ResponseEntity.notFound().build();

        Role role = roleRepository.findById(roleId).orElse(null);
        if (role == null) return ResponseEntity.notFound().build();

        roleRepository.delete(role);
        return ResponseEntity.noContent().build();
    }
}
