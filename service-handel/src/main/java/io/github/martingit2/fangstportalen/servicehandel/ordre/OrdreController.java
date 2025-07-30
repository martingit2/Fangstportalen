package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.organisasjon.OrganisasjonType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
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
@RequestMapping("/api/v1/ordrer")
@RequiredArgsConstructor
public class OrdreController {

    private final OrdreService ordreService;
    private static final Logger logger = LoggerFactory.getLogger(OrdreController.class);

    @PostMapping("/fra-fangstmelding")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<OrdreResponseDto> createOrdreFromFangstmelding(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long fangstmeldingId = payload.get("fangstmeldingId");
        if (fangstmeldingId == null) {
            return ResponseEntity.badRequest().build();
        }
        Long kjoperOrganisasjonId = principal.getOrganisasjonId();

        OrdreResponseDto createdOrdre = ordreService.createOrdreFromFangstmelding(fangstmeldingId, kjoperOrganisasjonId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/ordrer/{id}")
                .buildAndExpand(createdOrdre.id()).toUri();

        return ResponseEntity.created(location).body(createdOrdre);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<?> createOrdre(
            @Valid @RequestBody CreateOrdreRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        logger.info("Mottatt forespørsel om å opprette ordre for organisasjon: {}", principal.getOrganisasjonId());
        logger.debug("Innkommende DTO: {}", dto);

        try {
            Long kjoperOrganisasjonId = principal.getOrganisasjonId();
            OrdreResponseDto createdOrdreDto = ordreService.createOrdre(dto, kjoperOrganisasjonId);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(createdOrdreDto.id())
                    .toUri();

            logger.info("Ordre opprettet med ID: {}", createdOrdreDto.id());
            return ResponseEntity.created(location).body(createdOrdreDto);

        } catch (Exception e) {
            logger.error("!!! KRITISK FEIL under ordreopprettelse i Controller !!!", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("En kritisk feil oppstod. Sjekk server-loggen for detaljer.");
        }
    }

    @PatchMapping("/{id}/aksepter")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<OrdreResponseDto> aksepterOrdre(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        logger.info("Skipper forsøker å akseptere ordre med ID: {}", id);
        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        String selgerBrukerId = jwt.getSubject();

        OrdreResponseDto oppdatertOrdre = ordreService.aksepterOrdre(id, selgerOrganisasjonId, selgerBrukerId);

        logger.info("Ordre {} ble akseptert av organisasjon {}", id, selgerOrganisasjonId);
        return ResponseEntity.ok(oppdatertOrdre);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<Void> deleteOrdre(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long kjoperOrganisasjonId = principal.getOrganisasjonId();

        ordreService.deleteOrdre(id, kjoperOrganisasjonId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<OrdreResponseDto> updateOrdre(
            @PathVariable Long id,
            @Valid @RequestBody CreateOrdreRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long kjoperOrganisasjonId = principal.getOrganisasjonId();
        OrdreResponseDto updatedOrdre = ordreService.updateOrdre(id, dto, kjoperOrganisasjonId);
        return ResponseEntity.ok(updatedOrdre);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<OrdreResponseDto> getOrdreById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long kjoperOrganisasjonId = principal.getOrganisasjonId();
        OrdreResponseDto ordre = ordreService.findOrdreById(id, kjoperOrganisasjonId);
        return ResponseEntity.ok(ordre);
    }

    @GetMapping("/mine")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OrdreResponseDto>> getMineOrdrer(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Map<String, Object> claims = jwt.getClaimAsMap("https://fangstportalen.no/claims");
        OrganisasjonType orgType = OrganisasjonType.valueOf((String) claims.get("org_type"));
        List<OrdreResponseDto> ordrer = ordreService.findMineOrdrer(principal.getOrganisasjonId(), orgType);
        return ResponseEntity.ok(ordrer);
    }

    @GetMapping("/klare-for-sluttseddel")
    @PreAuthorize("hasAnyRole('REDERI_SKIPPER', 'REDERI_ADMIN')")
    public ResponseEntity<List<OrdreResponseDto>> getOrdrerKlareForSluttseddel(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        List<OrdreResponseDto> ordrer = ordreService.findMineAvtalteOrdrer(principal.getOrganisasjonId());
        return ResponseEntity.ok(ordrer);
    }

    @GetMapping("/tilgjengelige")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<List<OrdreResponseDto>> getTilgjengeligeOrdrer(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam(required = false) String leveringssted,
            @RequestParam(required = false) String fiskeslag) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        List<OrdreResponseDto> tilgjengeligeOrdrer = ordreService.findTilgjengeligeOrdrer(selgerOrganisasjonId, leveringssted, fiskeslag);
        return ResponseEntity.ok(tilgjengeligeOrdrer);
    }
}