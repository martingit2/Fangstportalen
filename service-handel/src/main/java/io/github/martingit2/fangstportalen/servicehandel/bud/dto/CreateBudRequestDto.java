package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateBudRequestDto(
        @NotNull @Positive Double budPrisPerKg
) {}