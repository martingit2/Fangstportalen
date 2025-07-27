package io.github.martingit2.fangstportalen.servicehandel.organisasjon;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganisasjonRepository extends JpaRepository<Organisasjon, Long> {
}