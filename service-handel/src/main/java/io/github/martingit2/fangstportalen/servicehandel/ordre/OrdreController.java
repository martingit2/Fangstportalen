package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.CreateOrdreRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
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
    @PreAuthorize("hasRole('fiskebruk-innkjoper')")
    public ResponseEntity<OrdreResponseDto> createOrdreFromFangstmelding(
            @RequestBody Map<String, Long> payload,
            @AuthenticationPrincipal Jwt jwt) {

        Long fangstmeldingId = payload.get("fangstmeldingId");
        String kjoperBrukerId = jwt.getSubject();

        OrdreResponseDto createdOrdre = ordreService.createOrdreFromFangstmelding(fangstmeldingId, kjoperBrukerId);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/ordrer/{id}")
                .buildAndExpand(createdOrdre.id()).toUri();

        return ResponseEntity.created(location).body(createdOrdre);
    }

    @PostMapping
    @PreAuthorize("hasRole('fiskebruk-innkjoper')")
    public ResponseEntity<?> createOrdre(
            @Valid @RequestBody CreateOrdreRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        logger.info("Mottatt forespørsel om å opprette ordre for bruker: {}", jwt.getSubject());
        logger.debug("Innkommende DTO: {}", dto);

        try {
            String kjoperBrukerId = jwt.getSubject();
            OrdreResponseDto createdOrdreDto = ordreService.createOrdre(dto, kjoperBrukerId);

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

    @GetMapping("/mine")
    @PreAuthorize("hasRole('fiskebruk-innkjoper')")
    public ResponseEntity<List<OrdreResponseDto>> getMineOrdrer(@AuthenticationPrincipal Jwt jwt) {
        String kjoperBrukerId = jwt.getSubject();
        List<OrdreResponseDto> ordrer = ordreService.findMineOrdrer(kjoperBrukerId);
        return ResponseEntity.ok(ordrer);
    }
}