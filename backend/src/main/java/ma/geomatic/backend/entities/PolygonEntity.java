package ma.geomatic.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.Polygon;

import java.awt.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "polygons")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PolygonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "polygon", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Property> properties = new HashSet<>();

    @Column(name = "geometry", columnDefinition = "geometry(Polygon, 4326)")
    private Polygon geometry;

}
