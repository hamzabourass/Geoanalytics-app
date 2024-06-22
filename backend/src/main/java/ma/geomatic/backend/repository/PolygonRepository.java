package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.PolygonEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PolygonRepository extends JpaRepository<PolygonEntity, Long> {
}
