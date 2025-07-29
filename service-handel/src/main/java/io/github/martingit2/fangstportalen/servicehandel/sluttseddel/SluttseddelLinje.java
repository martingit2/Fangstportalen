package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "sluttseddel_linjer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SluttseddelLinje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sluttseddel_id", nullable = false)
    private Sluttseddel sluttseddel;

    @Column(name = "ordrelinje_id", nullable = false)
    private Long ordrelinjeId;

    @Column(nullable = false)
    private String fiskeslag;

    @Column
    private String produkttilstand;

    @Column
    private String kvalitet;

    @Column
    private String storrelse;

    @Column(nullable = false)
    private Double faktiskKvantum;

    @Column(name = "avtalt_pris_per_kg", nullable = false)
    private Double avtaltPrisPerKg;
}