package ma.geomatic.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @NoArgsConstructor
@AllArgsConstructor
public class PolygonDTO {
    private List<PointDTO> coordinates;
}

