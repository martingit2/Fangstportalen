package io.github.martingit2.fangstportalen.servicehandel.team.dto;

import java.util.Set;

public record TeamMedlemResponseDto(
        String brukerId,
        Set<String> roller
) {}