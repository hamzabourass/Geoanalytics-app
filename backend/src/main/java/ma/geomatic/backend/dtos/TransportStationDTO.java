package ma.geomatic.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor @NoArgsConstructor @Data
public class TransportStationDTO {
    private Double osmId;
    private Double code;
    private String fclass;
    private String name;
    private PointDTO point;
}
