package io.github.martingit2.fangstportalen.servicehandel.util;

import org.springframework.data.domain.Page;
import java.util.List;

public record PagedResultDto<T>(
        List<T> content,
        int pageNumber,
        int totalPages,
        long totalElements
) {
    public PagedResultDto(Page<T> page) {
        this(
                page.getContent(),
                page.getNumber(),
                page.getTotalPages(),
                page.getTotalElements()
        );
    }
}