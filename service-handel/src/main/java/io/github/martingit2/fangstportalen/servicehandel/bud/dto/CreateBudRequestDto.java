package io.github.martingit2.fangstportalen.servicehandel.bud.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CreateBudRequestDto(
        @NotEmpty @Valid List<CreateBudLinjeDto> budLinjer
) {}