package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.CreateSluttseddelRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.dto.SluttseddelResponseDto;
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

@RestController
@RequestMapping("/api/v1/sluttsedler")
@RequiredArgsConstructor
public class SluttseddelController {

    private final SluttseddelService sluttseddelService;
    private static final Logger logger = LoggerFactory.getLogger(SluttseddelController.class);

    @PostMapping
    @PreAuthorize("hasRole('rederi-skipper')")
    public ResponseEntity<SluttseddelResponseDto> createSluttseddel(
            @Valid @RequestBody CreateSluttseddelRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt) {

        try {
            logger.info("Forsøker å opprette sluttseddel for bruker: {}", jwt.getSubject());
            String userId = jwt.getSubject();
            SluttseddelResponseDto createdSluttseddel = sluttseddelService.createSluttseddel(requestDto, userId);
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(createdSluttseddel.id()).toUri();
            logger.info("Sluttseddel opprettet med ID: {}", createdSluttseddel.id());
            return ResponseEntity.created(location).body(createdSluttseddel);
        } catch (Exception e) {
            logger.error("!!! KRITISK FEIL UNDER OPPRETTELSE AV SLUTTSEDDEL !!!", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{id}/signer-fisker")
    @PreAuthorize("hasRole('rederi-skipper')")
    public ResponseEntity<SluttseddelResponseDto> signerSomFisker(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        SluttseddelResponseDto signertSluttseddel = sluttseddelService.signerSomFisker(id, userId);
        return ResponseEntity.ok(signertSluttseddel);
    }

    @PostMapping("/{id}/bekreft-mottak")
    @PreAuthorize("hasAuthority('confirm:sluttseddel:mottak')")
    public ResponseEntity<SluttseddelResponseDto> bekreftMottak(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {
        String mottakUserId = jwt.getSubject();
        SluttseddelResponseDto bekreftetSluttseddel = sluttseddelService.bekreftMottak(id, mottakUserId);
        return ResponseEntity.ok(bekreftetSluttseddel);
    }

    @GetMapping("/mine")
    public ResponseEntity<List<SluttseddelResponseDto>> getMineSluttsedler(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        List<SluttseddelResponseDto> sluttsedler = sluttseddelService.getMineSluttsedler(userId);
        return ResponseEntity.ok(sluttsedler);
    }

    @GetMapping("/mottatt")
    @PreAuthorize("hasAuthority('read:sluttsedler:mottak')")
    public ResponseEntity<List<SluttseddelResponseDto>> getMottatteSluttsedler() {
        List<SluttseddelResponseDto> sluttsedler = sluttseddelService.getMottatteSluttsedler();
        return ResponseEntity.ok(sluttsedler);
    }
}