package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import java.time.LocalDate;
import java.util.List;

public record BudOversiktDto(
        Long fangstmeldingId,
        String fartoyNavn,
        String leveringssted,
        LocalDate tilgjengeligFraDato,
        KontaktinformasjonDto selgerKontakt,
        List<BudResponseDto> bud
) {}