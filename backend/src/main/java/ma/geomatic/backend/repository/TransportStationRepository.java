package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.TransportStation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TransportStationRepository extends JpaRepository<TransportStation, Long> {

    List<TransportStation> findByNameContainingIgnoreCase(String name);

    @Query("SELECT ts FROM TransportStation ts WHERE LOWER(ts.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(ts.fclass) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<TransportStation> searchByNameOrFclass(@Param("searchTerm") String searchTerm);

    List<TransportStation> findByFclassContaining(String fclass);

    List<TransportStation> findByCode(Double code);
}

