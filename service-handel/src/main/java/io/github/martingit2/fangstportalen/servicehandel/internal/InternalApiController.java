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



        if (apiKey == null || !apiKey.equals(appApiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return internalDataService.findUserClaims(brukerId)
                .map(claims -> {
                    return ResponseEntity.ok(claims);
                })
                .orElseGet(() -> {
                    return ResponseEntity.notFound().build();
                });
    }

    @PostMapping("/onboard-invited-user")
    public ResponseEntity<Void> onboardInvitedUser(
            @RequestBody InvitedUserDto dto,
            @RequestHeader("X-API-Key") String apiKey) {

        if (!apiKey.equals(appApiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        internalDataService.onboardInvitedUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}