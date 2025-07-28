package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.SluttseddelStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record SluttseddelResponseDto(
        Long id,
        Long ordreId,
        SluttseddelStatus status,
        LocalDate landingsdato,
        String fartoyNavn,
        String leveringssted,
        List<SluttseddelLinjeDto> linjer,
        LocalDateTime opprettetTidspunkt
) {}