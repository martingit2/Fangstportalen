package io.github.martingit2.fangstportalen.servicehandel.ordre;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdrelinjeRepository extends JpaRepository<Ordrelinje, Long> {
}