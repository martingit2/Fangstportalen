package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

public record SluttseddelLinjeDto(
        Long id,
        Long ordrelinjeId,
        String fiskeslag,
        Double faktiskKvantum
) {}