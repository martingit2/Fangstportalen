package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import java.time.LocalDateTime;

public record BudResponseDto(
        Long id,
        String kjoperOrganisasjonNavn,
        Double budPrisPerKg,
        String status,
        LocalDateTime opprettetTidspunkt
) {}