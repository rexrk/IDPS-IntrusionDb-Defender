package com.sentinel.idps.repository;

import com.sentinel.idps.entity.Attacks;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttacksRepository extends JpaRepository<Attacks, Integer> {
    List<Attacks> findAttacksByAttackerUsername(String attackerUsername);
}
