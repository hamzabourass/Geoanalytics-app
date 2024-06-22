package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.PointEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PointRepository extends JpaRepository<PointEntity, Long> {
}
