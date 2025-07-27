package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrdrelinjeDto(
        @NotBlank String fiskeslag,
        String kvalitet,
        String storrelse,
        @NotNull @Positive Double avtaltPrisPerKg,
        @NotNull @Positive Double forventetKvantum
) {}