package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.CreateFangstmeldingRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.dto.FangstmeldingResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.util.PagedResultDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/fangstmeldinger")
@RequiredArgsConstructor
public class FangstmeldingController {

    private final FangstmeldingService fangstmeldingService;

    @PostMapping
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<FangstmeldingResponseDto> createFangstmelding(
            @Valid @RequestBody CreateFangstmeldingRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        Map<String, Object> claims = jwt.getClaimAsMap("https://fangstportalen.no/claims");
        Long selgerOrganisasjonId = ((Number) claims.get("org_id")).longValue();
        String skipperBrukerId = jwt.getSubject();

        Object fartoyIdObj = claims.get("fartoy_id");
        if (fartoyIdObj == null) {
            throw new IllegalStateException("Fartøy ID mangler i token for skipper.");
        }
        Long fartoyId = ((Number) fartoyIdObj).longValue();

        FangstmeldingResponseDto createdFangstmeldingDto = fangstmeldingService.createFangstmeldingAndConvertToDto(dto, selgerOrganisasjonId, fartoyId, skipperBrukerId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdFangstmeldingDto.id())
                .toUri();

        return ResponseEntity.created(location).body(createdFangstmeldingDto);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<Void> deleteFangstmelding(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        fangstmeldingService.deleteFangstmelding(id, selgerOrganisasjonId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<FangstmeldingResponseDto> updateFangstmelding(
            @PathVariable Long id,
            @Valid @RequestBody CreateFangstmeldingRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        FangstmeldingResponseDto updatedFangstmelding = fangstmeldingService.updateFangstmelding(id, dto, selgerOrganisasjonId);
        return ResponseEntity.ok(updatedFangstmelding);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<FangstmeldingResponseDto> getFangstmeldingById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        return fangstmeldingService.findMineAktiveFangstmeldinger(new UserPrincipal(jwt).getOrganisasjonId(), Pageable.unpaged()).stream()
                .filter(f -> f.id().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/aktive")
    @PreAuthorize("hasAnyRole('FISKEBRUK_INNKJOPER', 'FISKEBRUK_ADMIN')")
    public ResponseEntity<PagedResultDto<FangstmeldingResponseDto>> getAktiveFangstmeldinger(
            @RequestParam(required = false) String leveringssted,
            @RequestParam(required = false) String fiskeslag,
            Pageable pageable) {
        Page<FangstmeldingResponseDto> aktiveMeldingerPage = fangstmeldingService.findAktiveFangstmeldinger(leveringssted, fiskeslag, pageable);
        return ResponseEntity.ok(new PagedResultDto<>(aktiveMeldingerPage));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('REDERI_SKIPPER', 'REDERI_ADMIN')")
    public ResponseEntity<PagedResultDto<FangstmeldingResponseDto>> getMineAktiveFangstmeldinger(
            @AuthenticationPrincipal Jwt jwt, Pageable pageable) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        Page<FangstmeldingResponseDto> aktiveMeldingerPage = fangstmeldingService.findMineAktiveFangstmeldinger(selgerOrganisasjonId, pageable);
        return ResponseEntity.ok(new PagedResultDto<>(aktiveMeldingerPage));
    }
}