package io.github.martingit2.fangstportalen.servicehandel.fangstmelding;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FangstmeldingRepository extends JpaRepository<Fangstmelding, Long> {

    List<Fangstmelding> findByStatusOrderByTilgjengeligFraDatoAsc(FangstmeldingStatus status);
}