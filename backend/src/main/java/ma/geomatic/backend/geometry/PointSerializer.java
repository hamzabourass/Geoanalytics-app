package ma.geomatic.backend.geometry;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.locationtech.jts.geom.Point;

import java.io.IOException;

public class PointSerializer extends JsonSerializer<Point> {

    @Override
    public void serialize(Point point, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        if (point != null) {
            gen.writeStartObject();
            gen.writeNumberField("longitude", point.getX());
            gen.writeNumberField("latitude", point.getY());
            gen.writeEndObject();
        }
    }
}

