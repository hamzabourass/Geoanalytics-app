package ma.geomatic.backend.service;

import jakarta.transaction.Transactional;
import ma.geomatic.backend.dtos.PointDTO;
import ma.geomatic.backend.dtos.PolygonDTO;
import ma.geomatic.backend.entities.TransportStation;
import ma.geomatic.backend.repository.TransportStationRepository;
import ma.geomatic.backend.repository.TransportStationRepositoryCustom;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class TransportStationService {

    private final TransportStationRepository transportStationRepository;
    private final TransportStationRepositoryCustom transportStationRepositoryCustom;

    public List<TransportStation> findAll() {
        log.info("Fetching all transport stations");
        return transportStationRepository.findAll();
    }

    public TransportStation findById(Long id) {
        log.info("Fetching transport station with id: {}", id);
        return transportStationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No transport station found with id: " + id));
    }

    public List<TransportStation> findNearbyStationsUsingCustom(Double longitude,Double latitude, Double distance) {
        log.info("Fetching nearby stations within distance: {} from point: {},{}", distance, longitude,latitude);
        validatePoint(longitude,latitude);
        validateDistance(distance);
        return transportStationRepositoryCustom.findNearbyStations(latitude, longitude, distance);
    }


    public List<TransportStation> findByFclass(String fclass) {
        log.info("Fetching transport stations with name containing: {}", fclass);
        validateName(fclass);
        return transportStationRepository.findByFclassContaining(fclass);
    }

    public List<TransportStation> searchByNameOrFclass(String searchTerm) {
        log.info("Searching transport stations with term: {}", searchTerm);
        validateSearchTerm(searchTerm);
        return transportStationRepository.searchByNameOrFclass(searchTerm);
    }

    public List<TransportStation> findByCode(Double code) {
        log.info("Fetching transport stations with code: {}", code);
        validateCode(code);
        return transportStationRepository.findByCode(code);
    }


    public List<TransportStation> findStationsWithinPolygon(PolygonDTO polygonDTO) {
        String polygonWKT = convertPolygonDTOToWKT(polygonDTO);
        return transportStationRepositoryCustom.findStationsWithinPolygon(polygonWKT);
    }

    private String convertPolygonDTOToWKT(PolygonDTO polygonDTO) {
        StringBuilder wktBuilder = new StringBuilder("POLYGON((");
        for (PointDTO point : polygonDTO.getCoordinates()) {
            wktBuilder.append(point.getLongitude()).append(" ").append(point.getLatitude()).append(",");
        }
        wktBuilder.setLength(wktBuilder.length() - 1); // Remove last comma
        wktBuilder.append("))");
        return wktBuilder.toString();
    }

    private void validatePoint(Double longitude, Double latitude) {
        if (latitude == null || longitude== null) {
            throw new IllegalArgumentException("PointDTO or its latitude/longitude cannot be null");
        }
    }

    private void validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
    }

    private void validateSearchTerm(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            throw new IllegalArgumentException("Search term cannot be null or empty");
        }
    }

    private void validateCode(Double code) {
        if (code == null) {
            throw new IllegalArgumentException("Code cannot be null");
        }
    }

    private void validateDistance(Double distance) {
        if (distance == null || distance < 0) {
            throw new IllegalArgumentException("Distance cannot be null or negative");
        }
    }

}

