package ma.geomatic.backend.dtos;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor @NoArgsConstructor @Data
public class PointDTO {
    private static final Logger logger = LoggerFactory.getLogger(PointDTO.class);

    private Double longitude;
    private Double latitude;

    public static PointDTO parseFromString(String pointString) {


        if (pointString == null || pointString.isEmpty()) {
            throw new IllegalArgumentException("Point string cannot be null or empty");
        }

        // Example parsing logic assuming pointString is in format "POINT(latitude longitude)"
        if (!pointString.startsWith("POINT(") || !pointString.endsWith(")")) {
            throw new IllegalArgumentException("Invalid point string format: " + pointString);
        }

        String coordinates = pointString.substring(6, pointString.length() - 1); // Remove "POINT(" and ")"
        String[] parts = coordinates.split("\\s+");

        if (parts.length != 2) {
            throw new IllegalArgumentException("Invalid point string format: " + pointString);
        }

        try {
            Double latitude = Double.parseDouble(parts[0]);
            Double longitude = Double.parseDouble(parts[1]);
            PointDTO pointDTO = new PointDTO(latitude, longitude);
            logger.debug("Parsed PointDTO: latitude={}, longitude={}", pointDTO.getLongitude(), pointDTO.getLatitude());
            return pointDTO;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid latitude or longitude in point string: " + pointString);
        }
    }
}
