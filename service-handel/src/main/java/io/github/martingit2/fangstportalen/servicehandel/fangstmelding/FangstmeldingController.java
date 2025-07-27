package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.CreateFangstmeldingRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstmeldingResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/fangstmeldinger")
@RequiredArgsConstructor
public class FangstmeldingController {

    private final FangstmeldingService fangstmeldingService;

    @PostMapping
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<Fangstmelding> createFangstmelding(
            @Valid @RequestBody CreateFangstmeldingRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();

        Fangstmelding createdFangstmelding = fangstmeldingService.createFangstmelding(dto, selgerOrganisasjonId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdFangstmelding.getId())
                .toUri();

        return ResponseEntity.created(location).body(createdFangstmelding);
    }

    @GetMapping("/aktive")
    @PreAuthorize("hasRole('FISKEBRUK_INNKJOPER')")
    public ResponseEntity<List<FangstmeldingResponseDto>> getAktiveFangstmeldinger() {
        List<FangstmeldingResponseDto> aktiveMeldinger = fangstmeldingService.findAktiveFangstmeldinger();
        return ResponseEntity.ok(aktiveMeldinger);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('REDERI_SKIPPER') or hasRole('REDERI_ADMIN')")
    public ResponseEntity<List<FangstmeldingResponseDto>> getMineAktiveFangstmeldinger(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        List<FangstmeldingResponseDto> aktiveMeldinger = fangstmeldingService.findMineAktiveFangstmeldinger(selgerOrganisasjonId);
        return ResponseEntity.ok(aktiveMeldinger);
    }
}