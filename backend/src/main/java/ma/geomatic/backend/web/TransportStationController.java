package ma.geomatic.backend.web;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import ma.geomatic.backend.dtos.PolygonDTO;
import ma.geomatic.backend.entities.TransportStation;
import ma.geomatic.backend.service.TransportStationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/stations")
@CrossOrigin(origins = "http://localhost:4200")
public class TransportStationController {

    private final TransportStationService transportStationService;

    @GetMapping
    public List<TransportStation> getAllStations() {
        return transportStationService.findAll();
    }

    @GetMapping("/{id}")
    public TransportStation getStationById(@PathVariable Long id) {
        return transportStationService.findById(id);
    }

    @GetMapping("/within")
    public List<TransportStation> getStationsWithin(@Valid @RequestParam Double longitude,
                                                    @RequestParam("latitude") Double latitude,
                                                    @RequestParam("distance") Double distance) {
        return transportStationService.findNearbyStationsUsingCustom(longitude,latitude, distance);
    }

    @GetMapping("/search")
    public List<TransportStation> search(@RequestParam String searchKey) {
        return transportStationService.searchByNameOrFclass(searchKey);
    }

    @GetMapping("/byFclass")
    public List<TransportStation> findByFclass(@RequestParam String fclass) {
        return transportStationService.findByFclass(fclass);
    }

    @GetMapping("/byCode/{code}")
    public List<TransportStation> getStationByCode(@PathVariable Double code) {
        return transportStationService.findByCode(code);
    }

    @PostMapping("/withinPolygon")
    public List<TransportStation> getStationsWithinPolygon(@RequestBody PolygonDTO polygonDTO) {
        return transportStationService.findStationsWithinPolygon(polygonDTO);
    }
}
