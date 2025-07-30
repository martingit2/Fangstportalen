package io.github.martingit2.fangstportalen.servicehandel.fartoy;

import io.github.martingit2.fangstportalen.servicehandel.organisasjon.Organisasjon;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fartoy")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fartoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eier_organisasjon_id", nullable = false)
    @ToString.Exclude
    private Organisasjon eierOrganisasjon;

    @Column(nullable = false)
    private String navn;

    @Column(nullable = false, unique = true)
    private String fiskerimerke;

    @Column(nullable = false)
    private String kallesignal;
}