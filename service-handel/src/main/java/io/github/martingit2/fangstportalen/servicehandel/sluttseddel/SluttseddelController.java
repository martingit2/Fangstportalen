package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.config.UserPrincipal;
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

@RestController
@RequestMapping("/api/v1/sluttsedler")
@RequiredArgsConstructor
public class SluttseddelController {

    private final SluttseddelService sluttseddelService;

    @PostMapping
    @PreAuthorize("hasRole('REDERI_SKIPPER')")
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
}