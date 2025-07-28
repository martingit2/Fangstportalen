package io.github.martingit2.fangstportalen.servicehandel.bud;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudRepository extends JpaRepository<Bud, Long> {
    List<Bud> findByFangstmeldingId(Long fangstmeldingId);
    List<Bud> findByFangstmeldingIdAndIdNot(Long fangstmeldingId, Long id);
}