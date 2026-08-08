package com.zeropscopilot.repository;

import com.zeropscopilot.entity.RepositoryProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<RepositoryProject, UUID> {
    Optional<RepositoryProject> findByName(String name);
    boolean existsByName(String name);
}
