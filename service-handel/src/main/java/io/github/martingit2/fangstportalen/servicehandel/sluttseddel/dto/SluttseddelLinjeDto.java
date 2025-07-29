package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

public record SluttseddelLinjeDto(
        Long id,
        Long ordrelinjeId,
        String fiskeslag,
        String produkttilstand,
        String kvalitet,
        String storrelse,
        Double faktiskKvantum,
        Double avtaltPrisPerKg,
        Double totalVerdi
) {}