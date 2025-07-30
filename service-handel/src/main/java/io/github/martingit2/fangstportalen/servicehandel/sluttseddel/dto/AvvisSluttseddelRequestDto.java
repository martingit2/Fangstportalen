package io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AvvisSluttseddelRequestDto(
        @NotBlank(message = "Begrunnelse kan ikke være tom.")
        @Size(max = 500, message = "Begrunnelse kan ikke være lenger enn 500 tegn.")
        String begrunnelse
) {}