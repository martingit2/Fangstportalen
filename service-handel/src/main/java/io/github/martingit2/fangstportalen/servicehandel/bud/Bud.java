package io.github.martingit2.fangstportalen.servicehandel.bud;

import io.github.martingit2.fangstportalen.servicehandel.fangstmelding.Fangstmelding;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(mappedBy = "bud", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BudLinje> budLinjer = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudStatus status;

    @CreationTimestamp
    @Column(name = "opprettet_tidspunkt", nullable = false, updatable = false)
    private LocalDateTime opprettetTidspunkt;

    public void addBudLinje(BudLinje linje) {
        budLinjer.add(linje);
        linje.setBud(this);
    }
}