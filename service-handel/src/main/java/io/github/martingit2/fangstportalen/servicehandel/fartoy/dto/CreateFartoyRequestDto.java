package io.github.martingit2.fangstportalen.servicehandel.fartoy.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateFartoyRequestDto(
        @NotBlank(message = "Navn kan ikke være tomt") String navn,
        @NotBlank(message = "Fiskerimerke kan ikke være tomt") String fiskerimerke,
        @NotBlank(message = "Kallesignal kan ikke være tomt") String kallesignal
) {}