package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import io.github.martingit2.fangstportalen.servicehandel.fartoy.Fartoy;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "fangstmeldinger")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fangstmelding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "selger_organisasjon_id", nullable = false, updatable = false)
    private Long selgerOrganisasjonId;

    @Column(name = "skipper_bruker_id", nullable = false, updatable = false)
    private String skipperBrukerId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fartoy_id", nullable = false)
    private Fartoy fartoy;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FangstmeldingStatus status;

    @OneToMany(mappedBy = "fangstmelding", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Fangstlinje> fangstlinjer = new ArrayList<>();

    @Column(nullable = false)
    private String leveringssted;

    @Column(name = "tilgjengelig_fra_dato", nullable = false)
    private LocalDate tilgjengeligFraDato;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    public void addFangstlinje(Fangstlinje fangstlinje) {
        fangstlinjer.add(fangstlinje);
        fangstlinje.setFangstmelding(this);
    }
}