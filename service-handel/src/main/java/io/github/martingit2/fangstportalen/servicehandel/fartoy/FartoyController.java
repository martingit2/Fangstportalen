package io.github.martingit2.fangstportalen.servicehandel.fartoy;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.dto.CreateFartoyRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fartoy.dto.FartoyResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/fartoy")
@RequiredArgsConstructor
public class FartoyController {

    private final FartoyService fartoyService;

    @PostMapping
    @PreAuthorize("hasRole('REDERI_ADMIN')")
    public ResponseEntity<FartoyResponseDto> createFartoy(
            @Valid @RequestBody CreateFartoyRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long eierOrganisasjonId = principal.getOrganisasjonId();

        FartoyResponseDto createdFartoy = fartoyService.createFartoy(requestDto, eierOrganisasjonId);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdFartoy);
    }
}