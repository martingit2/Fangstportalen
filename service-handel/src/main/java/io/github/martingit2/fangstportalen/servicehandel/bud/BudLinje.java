package io.github.martingit2.fangstportalen.servicehandel.bud;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bud_linjer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudLinje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bud_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Bud bud;

    @Column(name = "fangstlinje_id", nullable = false)
    private Long fangstlinjeId;

    @Column(name = "bud_pris_per_kg", nullable = false)
    private Double budPrisPerKg;
}