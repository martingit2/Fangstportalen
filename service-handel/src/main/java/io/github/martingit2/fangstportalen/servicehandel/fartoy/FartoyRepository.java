package io.github.martingit2.fangstportalen.servicehandel.fartoy;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FartoyRepository extends JpaRepository<Fartoy, Long> {
    List<Fartoy> findByEierOrganisasjonId(Long eierOrganisasjonId);
}