package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OppdaterOrganisasjonDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OrganisasjonDetaljerDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/organisasjoner")
@RequiredArgsConstructor
public class OrganisasjonController {

    private final OrganisasjonService organisasjonService;

    @GetMapping("/min")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<OrganisasjonDetaljerDto> getMinOrganisasjon(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        return ResponseEntity.ok(organisasjonService.getMinOrganisasjon(principal.getOrganisasjonId()));
    }

    @PutMapping("/min")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<OrganisasjonDetaljerDto> oppdaterMinOrganisasjon(@Valid @RequestBody OppdaterOrganisasjonDto dto, @AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        return ResponseEntity.ok(organisasjonService.oppdaterMinOrganisasjon(principal.getOrganisasjonId(), dto));
    }
}