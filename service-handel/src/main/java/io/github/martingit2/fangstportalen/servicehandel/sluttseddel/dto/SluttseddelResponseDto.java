package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.SluttseddelStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record SluttseddelResponseDto(
        Long id,
        String seddelnummer,
        Long ordreId,
        SluttseddelStatus status,
        LocalDate landingsdato,
        LocalTime landingsklokkeslett,
        String selgerNavn,
        String kjoperNavn,
        String fartoyNavn,
        String leveringssted,
        List<SluttseddelLinjeDto> linjer,
        Double totalVerdi,
        LocalDateTime opprettetTidspunkt
) {}