package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.LineStringEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LineStringRepository extends JpaRepository<LineStringEntity, Long> {
}
