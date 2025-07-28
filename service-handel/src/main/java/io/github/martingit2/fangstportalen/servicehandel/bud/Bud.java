package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bud")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bud {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fangstmelding_id", nullable = false)
    private Fangstmelding fangstmelding;

    @Column(name = "kjoper_organisasjon_id", nullable = false)
    private Long kjoperOrganisasjonId;

    @Column(name = "bud_pris_per_kg", nullable = false)
    private Double budPrisPerKg;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudStatus status;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;
}