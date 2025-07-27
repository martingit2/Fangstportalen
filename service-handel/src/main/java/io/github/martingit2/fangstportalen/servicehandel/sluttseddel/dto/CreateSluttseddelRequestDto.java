package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;

public record CreateSluttseddelRequestDto(
        @NotNull(message = "Landingsdato kan ikke være null.")
        @PastOrPresent(message = "Landingsdato kan ikke være i fremtiden.")
        LocalDate landingsdato,

        @NotBlank(message = "Fartøynavn kan ikke være tomt.")
        String fartoyNavn,

        @NotBlank(message = "Leveringssted kan ikke være tomt.")
        String leveringssted,

        @NotBlank(message = "Fiskeslag kan ikke være tomt.")
        String fiskeslag,

        @NotNull(message = "Kvantum kan ikke være null.")
        @Positive(message = "Kvantum må være et positivt tall.")
        Double kvantum
) {}