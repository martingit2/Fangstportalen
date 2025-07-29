package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudOversiktDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.BudResponseDto;
import io.github.martingit2.fangstportalen.servicehandel.bud.dto.CreateBudRequestDto;
import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import io.github.martingit2.fangstportalen.servicehandel.ordre.dto.OrdreResponseDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BudController {

    private final BudService budService;
    private final OrdreToDtoConverter ordreToDtoConverter;

    @PostMapping("/fangstmeldinger/{fangstmeldingId}/bud")
    @PreAuthorize("hasAnyRole('FISKEBRUK_ADMIN', 'FISKEBRUK_INNKJOPER')")
    public ResponseEntity<BudResponseDto> giBud(
            @PathVariable Long fangstmeldingId,
            @Valid @RequestBody CreateBudRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        String kjoperBrukerId = jwt.getSubject();
        BudResponseDto opprettetBud = budService.createBud(fangstmeldingId, principal.getOrganisasjonId(), kjoperBrukerId, dto);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/api/v1/bud/{id}")
                .buildAndExpand(opprettetBud.id()).toUri();

        return ResponseEntity.created(location).body(opprettetBud);
    }

    @GetMapping("/fangstmeldinger/{fangstmeldingId}/bud-oversikt")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'REDERI_SKIPPER')")
    public ResponseEntity<BudOversiktDto> getBudOversiktForFangstmelding(
            @PathVariable Long fangstmeldingId,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        BudOversiktDto oversikt = budService.getBudOversiktForFangstmelding(fangstmeldingId, principal.getOrganisasjonId());
        return ResponseEntity.ok(oversikt);
    }

    @PatchMapping("/bud/{budId}/aksepter")
    @PreAuthorize("hasAnyRole('REDERI_ADMIN', 'REDERI_SKIPPER')")
    public ResponseEntity<OrdreResponseDto> aksepterBud(
            @PathVariable Long budId,
            @AuthenticationPrincipal Jwt jwt) {

        UserPrincipal principal = new UserPrincipal(jwt);
        String selgerBrukerId = jwt.getSubject();
        Ordre opprettetOrdre = budService.aksepterBud(budId, principal.getOrganisasjonId(), selgerBrukerId);
        OrdreResponseDto responseDto = ordreToDtoConverter.convertToResponseDto(opprettetOrdre);
        return ResponseEntity.ok(responseDto);
    }
}