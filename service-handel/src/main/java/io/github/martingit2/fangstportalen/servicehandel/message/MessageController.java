package io.github.martingit2.fangstportalen.servicehandel.message;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/messages")

@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {


    @GetMapping("/public")
    public ResponseEntity<String> getPublicMessage() {
        return ResponseEntity.ok("Hello from a public endpoint!");
    }


    @GetMapping("/protected")
    public ResponseEntity<String> getProtectedMessage(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        String message = "Hello from a protected endpoint! Your user ID is: " + userId;
        return ResponseEntity.ok(message);
    }
}