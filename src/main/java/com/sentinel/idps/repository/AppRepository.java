package com.sentinel.idps.repository;

import com.sentinel.idps.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppRepository extends JpaRepository<Application, Integer> {
    Application findByApplicationName(String applicationName);
}
