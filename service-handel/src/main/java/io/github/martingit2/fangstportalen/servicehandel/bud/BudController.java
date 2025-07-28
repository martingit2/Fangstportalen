package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.CreateBudRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BudController {

    private final BudService budService;

    @PostMapping("/fangstmeldinger/{fangstmeldingId}/bud")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<BudResponseDto> giBud(
            @PathVariable Long fangstmeldingId,
            @Valid @RequestBody CreateBudRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        BudResponseDto opprettetBud = budService.createBud(fangstmeldingId, principal.getOrganisasjonId(), dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/bud/{id}")
                .buildAndExpand(opprettetBud.id()).toUri();

        return ResponseEntity.created(location).body(opprettetBud);
    }

    @GetMapping("/fangstmeldinger/{fangstmeldingId}/bud")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'REDERI_SKIPPER')")
    public ResponseEntity<List<BudResponseDto>> getBudForFangstmelding(
            @PathVariable Long fangstmeldingId,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        List<BudResponseDto> bud = budService.getBudForFangstmelding(fangstmeldingId, principal.getOrganisasjonId());
        return ResponseEntity.ok(bud);
    }
}