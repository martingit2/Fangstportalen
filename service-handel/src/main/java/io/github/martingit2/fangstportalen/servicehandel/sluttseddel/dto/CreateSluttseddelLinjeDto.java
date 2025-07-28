package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateSluttseddelLinjeDto(
        @NotNull Long ordrelinjeId,
        @NotNull @Positive Double faktiskKvantum
) {}