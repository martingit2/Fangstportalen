package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BudResponseDto(
        Long id,
        String kjoperOrganisasjonNavn,
        List<BudLinjeResponseDto> budLinjer,
        String status,
        LocalDateTime opprettetTidspunkt
) {}