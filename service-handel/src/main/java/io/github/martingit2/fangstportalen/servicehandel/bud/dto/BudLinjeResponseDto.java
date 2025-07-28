package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

public record BudLinjeResponseDto(
        Long id,
        Long fangstlinjeId,
        String fiskeslag,
        Double budPrisPerKg
) {}