package io.github.martingit2.fangstportalen.servicehandel.bud;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BudLinjeRepository extends JpaRepository<BudLinje, Long> {
}