package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Organisasjon organisasjon;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BrukerRolle rolle;
}