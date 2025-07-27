package io.github.martingit2.fangstportalen.servicehandel.ordre.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;
import java.util.List;

public record CreateOrdreRequestDto(
        @NotBlank String leveringssted,
        @NotNull LocalDate forventetLeveringsdato,
        @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Ugyldig tidsformat. Bruk HH:MM")
        String forventetLeveringstidFra,
        @Pattern(regexp = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$", message = "Ugyldig tidsformat. Bruk HH:MM")
        String forventetLeveringstidTil,
        @NotEmpty @Valid List<CreateOrdrelinjeDto> ordrelinjer
) {}