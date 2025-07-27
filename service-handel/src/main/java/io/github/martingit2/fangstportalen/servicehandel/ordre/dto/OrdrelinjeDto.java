package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;


public record OrdrelinjeDto(
        Long id,
        String fiskeslag,
        String kvalitet,
        String storrelse,
        Double avtaltPrisPerKg,
        Double forventetKvantum
) {}