package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import java.time.LocalDate;
import java.util.List;

public record CreateSluttseddelRequestDto(
        @NotNull Long ordreId,
        @NotNull @PastOrPresent LocalDate landingsdato,
        @NotEmpty @Valid List<CreateSluttseddelLinjeDto> linjer
) {}