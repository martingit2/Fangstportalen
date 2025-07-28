package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fangstlinjer")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fangstlinje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fangstmelding_id", nullable = false)
    @JsonIgnore
    private Fangstmelding fangstmelding;

    @Column(nullable = false)
    private String fiskeslag;

    @Column(nullable = false)
    private Double estimertKvantum;

    @Column(name = "utropspris_per_kg", nullable = false)
    private Double utropsprisPerKg;

    private String kvalitet;

    private String storrelse;
}