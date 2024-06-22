package ma.geomatic.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.locationtech.jts.geom.LineString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "linestrings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LineStringEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "lineString", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Property> properties = new HashSet<>();

    @Column(name = "geometry", columnDefinition = "geometry(LineString, 4326)")
    private LineString geometry;

}
