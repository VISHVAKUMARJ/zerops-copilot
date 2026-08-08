package com.zeropscopilot.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ProjectResponse(
    UUID id,
    String name,
    String repositoryUrl,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
