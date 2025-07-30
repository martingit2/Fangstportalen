package io.github.martingit2.fangstportalen.servicehandel.team.dto;

import jakarta.validation.constraints.NotNull;

public record TildelFartoyRequestDto(
        @NotNull Long fartoyId
) {}