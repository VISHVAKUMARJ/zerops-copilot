package com.zeropscopilot.repository;

import com.zeropscopilot.entity.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, UUID> {
    List<Deployment> findByProjectId(UUID projectId);
    List<Deployment> findByProjectIdOrderByCreatedAtDesc(UUID projectId);
    List<Deployment> findByStatus(Deployment.DeploymentStatus status);
}
