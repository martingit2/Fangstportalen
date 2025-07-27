package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.SluttseddelStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record SluttseddelResponseDto(
        Long id,
        String userId,
        SluttseddelStatus status,
        LocalDate landingsdato,
        String fartoyNavn,
        String leveringssted,
        String fiskeslag,
        Double kvantum,
        LocalDateTime opprettetTidspunkt,
        LocalDateTime fiskerSignaturTidspunkt,
        String mottakSignaturUserId,
        LocalDateTime mottakSignaturTidspunkt
) {}