package io.github.martingit2.fangstportalen.servicehandel.bruker;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;


@RestController @RequestMapping("/api/v1/brukere") @RequiredArgsConstructor
public class BrukerController {
    private final BrukerService brukerService;
    @GetMapping("/min-profil") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MinProfilDto> getMinProfil(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        return ResponseEntity.ok(brukerService.getMinProfil(principal.getOrganisasjonId(), jwt.getSubject()));
    }
    @PutMapping("/min-profil") @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MinProfilDto> oppdaterMinProfil(@Valid @RequestBody OppdaterMinProfilDto dto, @AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        return ResponseEntity.ok(brukerService.oppdaterMinProfil(principal.getOrganisasjonId(), jwt.getSubject(), dto));
    }
}
