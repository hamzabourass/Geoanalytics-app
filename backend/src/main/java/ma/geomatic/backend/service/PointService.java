package ma.geomatic.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import ma.geomatic.backend.repository.PointRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class PointService {
    private final PointRepository pointRepository;
}
