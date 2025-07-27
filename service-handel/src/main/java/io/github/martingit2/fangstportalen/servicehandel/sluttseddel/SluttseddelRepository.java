package io.github.martingit2.fangstportalen.servicehandel.sluttseddel;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SluttseddelRepository extends JpaRepository<Sluttseddel, Long> {

    List<Sluttseddel> findBySelgerOrganisasjonIdOrderByLandingsdatoDesc(Long selgerOrganisasjonId);

    List<Sluttseddel> findByStatusOrderByLandingsdatoDesc(SluttseddelStatus status);
}