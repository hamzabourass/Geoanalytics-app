package ma.geomatic.backend.geometry;

import ma.geomatic.backend.dtos.PointDTO;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PointDeserializer{

    public Point convertJsonToGeometry(PointDTO point) throws Exception {
        GeometryFactory geometryFactory = new GeometryFactory();
        return geometryFactory.createPoint(new Coordinate(point.getLongitude(), point.getLatitude()));
    }
}

