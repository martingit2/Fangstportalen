package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "organisasjon_brukere")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrganisasjonBruker {

    @EmbeddedId
    private OrganisasjonBrukerId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("organisasjonId")
    @JoinColumn(name = "organisasjon_id")
    @ToString.Exclude
    private Organisasjon organisasjon;

    @Column(nullable = false)
    private String navn;

    @Column
    private String tittel;

    @Column
    private String telefonnummer;

    @ElementCollection(targetClass = BrukerRolle.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "bruker_roller", joinColumns = {
            @JoinColumn(name = "organisasjon_id", referencedColumnName = "organisasjon_id"),
            @JoinColumn(name = "bruker_id", referencedColumnName = "brukerId")
    })
    @Enumerated(EnumType.STRING)
    @Column(name = "rolle", nullable = false)
    @Builder.Default
    private Set<BrukerRolle> roller = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tildelt_fartoy_id")
    @ToString.Exclude
    private Fartoy tildeltFartoy;
}