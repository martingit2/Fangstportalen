package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateBudLinjeDto(
        @NotNull Long fangstlinjeId,
        @NotNull @Positive Double budPrisPerKg
) {}