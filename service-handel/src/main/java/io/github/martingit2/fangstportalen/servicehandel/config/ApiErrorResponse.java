package io.github.martingit2.fangstportalen.servicehandel.config;

import java.time.LocalDateTime;
import java.util.List;

public record ApiErrorResponse(
        int statusCode,
        String path,
        String message,
        List<String> details,
        LocalDateTime timestamp
) {}