package ma.geomatic.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import ma.geomatic.backend.repository.PolygonRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class PolygonService {
    private final PolygonRepository polygonRepository;
}
