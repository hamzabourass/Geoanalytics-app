package ma.geomatic.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "geometry_properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_key")
    private String key;

    @Column(name = "property_value")
    private String value;

    @ManyToOne
    @JoinColumn(name = "line_string_id")
    private LineStringEntity lineString;

    @ManyToOne
    @JoinColumn(name = "point_id")
    private PointEntity point;

    @ManyToOne
    @JoinColumn(name = "polygon_id")
    private PolygonEntity polygon;

}
