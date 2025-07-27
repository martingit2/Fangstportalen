package io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto;

public record FangstlinjeResponseDto(
        Long id,
        String fiskeslag,
        Double estimertKvantum,
        String kvalitet,
        String storrelse
) {}