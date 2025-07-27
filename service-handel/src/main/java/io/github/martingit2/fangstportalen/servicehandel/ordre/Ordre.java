package io.github.martingit2.fangstportalen.servicehandel.ordre;

import io.github.martingit2.fangstportalen.servicehandel.sluttseddel.Sluttseddel;
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
@Table(name = "ordrer", uniqueConstraints = {
        @UniqueConstraint(columnNames = "fangstmelding_id", name = "uk_ordre_fangstmelding_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ordre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fangstmelding_id")
    private Long fangstmeldingId;

    @Column(name = "kjoper_organisasjon_id", nullable = false)
    private Long kjoperOrganisasjonId;

    @Column(name = "selger_organisasjon_id")
    private Long selgerOrganisasjonId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrdreStatus status;

    @OneToMany(mappedBy = "ordre", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Ordrelinje> ordrelinjer = new ArrayList<>();

    @OneToOne(mappedBy = "ordre")
    private Sluttseddel sluttseddel;

    @Column(nullable = false)
    private String leveringssted;

    @Column(name = "forventet_leveringsdato")
    private LocalDate forventetLeveringsdato;

    @Column(name = "forventet_leveringstid_fra")
    private LocalTime forventetLeveringstidFra;

    @Column(name = "forventet_leveringstid_til")
    private LocalTime forventetLeveringstidTil;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    public void addOrdrelinje(Ordrelinje ordrelinje) {
        ordrelinjer.add(ordrelinje);
        ordrelinje.setOrdre(this);
    }
}