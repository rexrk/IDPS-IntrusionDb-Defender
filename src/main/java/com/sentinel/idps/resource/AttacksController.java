package com.sentinel.idps.resource;

import com.sentinel.idps.entity.Attacks;
import com.sentinel.idps.repository.AttacksRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/attacks")
public class AttacksController {
    private final AttacksRepository attacksRepository;

    public AttacksController(AttacksRepository attacksRepository) {
        this.attacksRepository = attacksRepository;
    }

    @GetMapping("")
    public List<Attacks> getAllAttacks() {
        return attacksRepository.findAll();
    }

    @GetMapping("/{id}")
    public Attacks getAttackById(@PathVariable Integer id) {
        return attacksRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteAttackById(@PathVariable Integer id) {
        attacksRepository.delete(getAttackById(id));
    }

    void addAttack(Attacks attacks) {
        attacksRepository.save(attacks);
    }

    List<Attacks> getAttackByUsername(String username) {
        return attacksRepository.findAttacksByAttackerUsername(username);
    }

    public void createAttack(String username, String ipAddress, String attackType,
                             String targetResource, String severityLevel, String status, String description, String applicationName) {
        Attacks attacks = new Attacks();
        attacks.setApplicationName(applicationName);
        attacks.setAttackerUsername(username);
        attacks.setTimestamp(LocalDateTime.now());
        attacks.setAttackerIpAddress(ipAddress);
        attacks.setAttackerLocation("India");
        attacks.setAttackType(attackType);
        attacks.setTargetedResource(targetResource);
        attacks.setSeverityLevel(severityLevel);
        attacks.setStatus(status);
        attacks.setDescription(description);
        attacksRepository.save(attacks);
    }

}
