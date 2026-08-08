package com.zeropscopilot.dto.request;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.URL;

public record CreateProjectRequest(
    @NotBlank(message = "Project name is required")
    String name,
    
    @NotBlank(message = "Repository URL is required")
    @URL(message = "Repository URL must be a valid URL")
    String repositoryUrl,
    
    String description
) {}
