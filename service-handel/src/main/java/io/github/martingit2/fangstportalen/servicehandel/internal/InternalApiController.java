package io.github.martingit2.fangstportalen.servicehandel.internal;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/internal")
@RequiredArgsConstructor
public class InternalApiController {

    private final InternalDataService internalDataService;
    private static final Logger log = LoggerFactory.getLogger(InternalApiController.class);

    @Value("${app.api-key}")
    private String appApiKey;

    @GetMapping("/user-claims/{brukerId}")
    public ResponseEntity<UserClaimsResponseDto> getUserClaims(
            @PathVariable String brukerId,
            @RequestHeader(value = "X-API-Key", required = false) String apiKey) {

        log.debug("Mottok forespørsel for bruker-claims for ID: {}", brukerId);

        if (apiKey == null) {
            log.warn("Kallet manglet X-API-Key headeren. Avviser.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!apiKey.equals(appApiKey)) {
            log.warn("Kallet hadde en ugyldig X-API-Key. Avviser.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        log.info("API-nøkkel validert. Henter claims for bruker: {}", brukerId);

        return internalDataService.findUserClaims(brukerId)
                .map(claims -> {
                    log.info("Fant claims for bruker {}: {}", brukerId, claims);
                    return ResponseEntity.ok(claims);
                })
                .orElseGet(() -> {
                    log.warn("Fant ingen claims for bruker {}. Returnerer 404 Not Found.", brukerId);
                    return ResponseEntity.notFound().build();
                });
    }
}