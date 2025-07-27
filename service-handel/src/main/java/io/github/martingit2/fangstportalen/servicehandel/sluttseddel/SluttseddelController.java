package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
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
import java.util.Map;

@RestController
@RequestMapping("/api/v1/sluttsedler")
@RequiredArgsConstructor
public class SluttseddelController {

    private final SluttseddelService sluttseddelService;
    private static final Logger logger = LoggerFactory.getLogger(SluttseddelController.class);

    @PostMapping
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<SluttseddelResponseDto> createSluttseddel(
            @Valid @RequestBody CreateSluttseddelRequestDto requestDto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();

        // TODO: Må hente kjoperOrganisasjonId fra f.eks. en Ordre i fremtiden
        // For nå, setter vi en dummy-verdi eller kaster en feil
        Long dummyKjoperOrganisasjonId = 2L;

        logger.info("Forsøker å opprette sluttseddel for organisasjon: {}", selgerOrganisasjonId);

        SluttseddelResponseDto createdSluttseddel = sluttseddelService.createSluttseddel(requestDto, selgerOrganisasjonId, dummyKjoperOrganisasjonId);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(createdSluttseddel.id()).toUri();
        logger.info("Sluttseddel opprettet med ID: {}", createdSluttseddel.id());

        return ResponseEntity.created(location).body(createdSluttseddel);
    }

    @PostMapping("/{id}/signer-fisker")
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
    public ResponseEntity<SluttseddelResponseDto> signerSomFisker(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();
        String skipperBrukerId = jwt.getSubject();

        SluttseddelResponseDto signertSluttseddel = sluttseddelService.signerSomFisker(id, selgerOrganisasjonId, skipperBrukerId);
        return ResponseEntity.ok(signertSluttseddel);
    }

    @PostMapping("/{id}/bekreft-mottak")
    @PreAuthorize("hasRole('FISKEBRUK_INNKJOPER')")
    public ResponseEntity<SluttseddelResponseDto> bekreftMottak(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        Long kjoperOrganisasjonId = principal.getOrganisasjonId();
        String mottakBrukerId = jwt.getSubject();

        SluttseddelResponseDto bekreftetSluttseddel = sluttseddelService.bekreftMottak(id, kjoperOrganisasjonId, mottakBrukerId);
        return ResponseEntity.ok(bekreftetSluttseddel);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('REDERI_SKIPPER') or hasRole('REDERI_ADMIN')")
    public ResponseEntity<List<SluttseddelResponseDto>> getMineSluttsedler(@AuthenticationPrincipal Jwt jwt) {
        UserPrincipal principal = new UserPrincipal(jwt);
        Long selgerOrganisasjonId = principal.getOrganisasjonId();

        List<SluttseddelResponseDto> sluttsedler = sluttseddelService.getMineSluttsedler(selgerOrganisasjonId);
        return ResponseEntity.ok(sluttsedler);
    }

    @GetMapping("/mottatt")
    @PreAuthorize("hasRole('FISKEBRUK_INNKJOPER') or hasRole('FISKEBRUK_ADMIN')")
    public ResponseEntity<List<SluttseddelResponseDto>> getMottatteSluttsedler() {
        // TODO: Denne må filtreres på innlogget brukers organisasjon
        List<SluttseddelResponseDto> sluttsedler = sluttseddelService.getMottatteSluttsedler();
        return ResponseEntity.ok(sluttsedler);
    }
}