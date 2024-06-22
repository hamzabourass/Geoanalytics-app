package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.TransportStation;
import org.locationtech.jts.geom.Point;
import org.locationtech.jts.io.ParseException;
import org.locationtech.jts.io.WKTReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Repository
public class TransportStationRepositoryImpl implements TransportStationRepositoryCustom {


    private final JdbcTemplate jdbcTemplate;
    private final WKTReader wktReader;

    @Autowired
    public TransportStationRepositoryImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
        this.wktReader = new WKTReader();
    }

    // Nearby stations (distance is in meters)
    @Override
    public List<TransportStation> findNearbyStations(double latitude, double longitude, double distance) {
        String sql = "SELECT id, code, fclass, name, ST_AsText(geometry) as geometry FROM transport_stations " +
                     "WHERE ST_DWithin(geometry::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326), ?)";
        return jdbcTemplate.query(sql, new Object[]{longitude, latitude, distance}, (rs, rowNum) -> {
            TransportStation station = new TransportStation();
            station.setId(rs.getLong("id"));
            station.setCode(rs.getDouble("code"));
            station.setFclass(rs.getString("fclass"));
            station.setName(rs.getString("name"));

            // Handling Point geometry
            String geometryWKT = rs.getString("geometry");
            Point point = null;
            try {
                point = (Point) wktReader.read(geometryWKT);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
            station.setGeometry(point);

            return station;
        });
    }

    // Stations within a polygon
    @Override
    public List<TransportStation> findStationsWithinPolygon(String polygonWkt) {
        String sql = "SELECT id, code, fclass, name, ST_AsText(geometry) as geometry FROM transport_stations " +
                "WHERE ST_Within(geometry, ST_GeomFromText(?, 4326))";
        return jdbcTemplate.query(sql, new Object[]{polygonWkt}, (rs, rowNum) -> {
            TransportStation station = new TransportStation();
            station.setId(rs.getLong("id"));
            station.setCode(rs.getDouble("code"));
            station.setFclass(rs.getString("fclass"));
            station.setName(rs.getString("name"));

            // Handling Point geometry
            String geometryWKT = rs.getString("geometry");
            Point point = null;
            try {
                point = (Point) wktReader.read(geometryWKT);
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
            station.setGeometry(point);

            return station;
        });
    }


}