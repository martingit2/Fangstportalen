package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.dto.OnboardingRequestDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/onboarding")
@RequiredArgsConstructor
public class OnboardingController {

    private final OnboardingService onboardingService;

    @PostMapping("/registrer")
    public ResponseEntity<Void> registrerOrganisasjon(
            @Valid @RequestBody OnboardingRequestDto dto,
            @AuthenticationPrincipal Jwt jwt) {

        String adminBrukerId = jwt.getSubject();
        onboardingService.onboardNewOrganisasjon(dto, adminBrukerId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}