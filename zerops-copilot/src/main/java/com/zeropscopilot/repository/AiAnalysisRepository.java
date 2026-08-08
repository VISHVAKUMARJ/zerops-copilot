package com.zeropscopilot.repository;

import com.zeropscopilot.entity.AiAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AiAnalysisRepository extends JpaRepository<AiAnalysis, UUID> {

    Optional<AiAnalysis> findByDeploymentId(UUID deploymentId);

}