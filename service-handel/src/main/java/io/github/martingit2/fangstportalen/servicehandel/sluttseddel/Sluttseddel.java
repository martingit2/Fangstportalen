package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import io.github.martingit2.fangstportalen.servicehandel.ordre.Ordre;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sluttsedler", indexes = {
        @Index(name = "idx_sluttseddel_selger_org_id", columnList = "selgerOrganisasjonId"),
        @Index(name = "idx_sluttseddel_kjoper_org_id", columnList = "kjoperOrganisasjonId")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Sluttseddel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String seddelnummer;

    @OneToOne
    @JoinColumn(name = "ordre_id", referencedColumnName = "id", unique = true, nullable = false)
    private Ordre ordre;

    @OneToMany(mappedBy = "sluttseddel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<SluttseddelLinje> sluttseddelLinjer = new ArrayList<>();

    @Column(name = "selger_organisasjon_id", nullable = false, updatable = false)
    private Long selgerOrganisasjonId;

    @Column(name = "selger_navn", nullable = false)
    private String selgerNavn;

    @Column(name = "selger_org_nr", nullable = false)
    private String selgerOrgNr;

    @Column(name = "kjoper_organisasjon_id", nullable = false, updatable = false)
    private Long kjoperOrganisasjonId;

    @Column(name = "kjoper_navn", nullable = false)
    private String kjoperNavn;

    @Column(name = "kjoper_org_nr", nullable = false)
    private String kjoperOrgNr;

    @Column(name = "fartoy_navn", nullable = false)
    private String fartoyNavn;

    @Column(name = "fartoy_fiskerimerke", nullable = false)
    private String fartoyFiskerimerke;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SluttseddelStatus status;

    @Column(nullable = false)
    private LocalDate landingsdato;

    @Column
    private LocalTime landingsklokkeslett;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    public void addSluttseddelLinje(SluttseddelLinje linje) {
        sluttseddelLinjer.add(linje);
        linje.setSluttseddel(this);
    }
}