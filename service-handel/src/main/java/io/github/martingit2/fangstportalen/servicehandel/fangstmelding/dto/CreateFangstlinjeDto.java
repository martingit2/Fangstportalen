package io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateFangstlinjeDto(
        @NotBlank String fiskeslag,
        @NotNull @Positive Double estimertKvantum,
        String kvalitet,
        String storrelse
) {}