package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import java.util.List;

public record CreateOrdreRequestDto(
        LocalDate forventetLeveringsdato,
        @NotEmpty @Valid List<CreateOrdrelinjeDto> ordrelinjer
) {}