package io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public record CreateFangstmeldingRequestDto(
        @NotBlank String fartoyNavn,
        @NotBlank String leveringssted,
        @NotNull @FutureOrPresent LocalDate tilgjengeligFraDato,
        @NotEmpty @Valid List<CreateFangstlinjeDto> fangstlinjer
) {}