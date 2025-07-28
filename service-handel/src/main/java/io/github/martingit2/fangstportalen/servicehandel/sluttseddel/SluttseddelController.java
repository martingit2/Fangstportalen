package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sluttsedler")
@RequiredArgsConstructor
public class SluttseddelController {

    private final SluttseddelService sluttseddelService;

    @PostMapping
    @PreAuthorize("hasAnyRole('REDERI_SKIPPER', 'REDERI_ADMIN')")
    public ResponseEntity<SluttseddelResponseDto> createSluttseddel(
            @Valid @RequestBody CreateSluttseddelRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();

        SluttseddelResponseDto createdSluttseddel = sluttseddelService.createSluttseddelFromOrdre(requestDto, selgerOrganisasjonId);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdSluttseddel.id())
                .toUri();

        return ResponseEntity.created(location).body(createdSluttseddel);
    }

    @PatchMapping("/{id}/bekreft")
    @PreAuthorize("hasAnyRole('FISKEBRUK_INNKJOPER', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<SluttseddelResponseDto> bekreftSluttseddel(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        SluttseddelResponseDto bekreftetSluttseddel = sluttseddelService.bekreftSluttseddel(id, principal.getOrganisasjonId());
        return ResponseEntity.ok(bekreftetSluttseddel);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'REDERI_SKIPPER', 'FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<List<SluttseddelResponseDto>> getMineSluttsedler(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Map<String, Object> claims = jwt.getClaimAsMap("https://fangstportalen.no/claims");
        OrganisasjonType orgType = OrganisasjonType.valueOf((String) claims.get("org_type"));

        List<SluttseddelResponseDto> sedler = sluttseddelService.getMineSluttsedler(principal.getOrganisasjonId(), orgType);
        return ResponseEntity.ok(sedler);
    }
}