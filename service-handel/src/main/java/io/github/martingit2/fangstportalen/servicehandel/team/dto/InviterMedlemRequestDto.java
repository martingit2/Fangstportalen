package io.github.martingit2.fangstportalen.servicehandel.team.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record InviterMedlemRequestDto(
        @NotBlank @Email String email,
        @NotEmpty Set<String> roller
) {}