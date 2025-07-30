package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record OrdreResponseDto(
        Long id,
        String status,
        String kjoperOrganisasjonNavn,
        String selgerOrganisasjonNavn,
        String leveringssted,
        LocalDate forventetLeveringsdato,
        LocalTime forventetLeveringstidFra,
        LocalTime forventetLeveringstidTil,
        LocalDateTime opprettetTidspunkt,
        List<OrdrelinjeDto> ordrelinjer
) {}