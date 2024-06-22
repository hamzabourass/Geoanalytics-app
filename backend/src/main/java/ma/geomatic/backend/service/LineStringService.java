package ma.geomatic.backend.service;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import ma.geomatic.backend.repository.LineStringRepository;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class LineStringService {
    private final LineStringRepository lineStringRepository;
}
