package io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record FangstmeldingResponseDto(
        Long id,
        String skipperBrukerId,
        String fartoyNavn,
        String status,
        String leveringssted,
        LocalDate tilgjengeligFraDato,
        LocalDateTime opprettetTidspunkt,
        List<FangstlinjeResponseDto> fangstlinjer
) {}