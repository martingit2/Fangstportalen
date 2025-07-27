package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "organisasjoner")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organisasjon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String navn;

    @Column(nullable = false, unique = true)
    private String organisasjonsnummer;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrganisasjonType type;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;
}