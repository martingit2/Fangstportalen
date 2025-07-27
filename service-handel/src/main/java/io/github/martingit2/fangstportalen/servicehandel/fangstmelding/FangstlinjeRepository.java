package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FangstlinjeRepository extends JpaRepository<Fangstlinje, Long> {
}