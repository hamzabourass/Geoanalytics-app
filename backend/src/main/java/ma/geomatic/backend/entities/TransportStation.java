package ma.geomatic.backend.entities;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.persistence.*;
import lombok.*;
import ma.geomatic.backend.geometry.GeometryType;
import ma.geomatic.backend.geometry.PointSerializer;
import org.hibernate.annotations.Type;
import org.locationtech.jts.geom.Point;

@Data
@Entity
@Table(name = "transport_stations")
@Setter @Getter @AllArgsConstructor @NoArgsConstructor @Builder
public class TransportStation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "osm_id")
    private Double osmId;

    @Column(name = "code", nullable = true)
    private Double code;

    @Column(name = "fclass")
    private String fclass;

    @Column(name = "name")
    private String name;


    @Column(name = "geometry", columnDefinition = "geometry(Point, 4326)")
    @JsonSerialize(using = PointSerializer.class)
    @Type(GeometryType.class)
    private Point geometry;

}