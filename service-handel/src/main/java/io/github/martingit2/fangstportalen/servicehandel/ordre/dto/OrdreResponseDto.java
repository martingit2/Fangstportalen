package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;


public record OrdreResponseDto(
        Long id,
        String status,
        LocalDate forventetLeveringsdato,
        LocalDateTime opprettetTidspunkt,
        List<OrdrelinjeDto> ordrelinjer
) {}