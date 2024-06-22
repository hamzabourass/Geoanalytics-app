package ma.geomatic.backend.repository;

import ma.geomatic.backend.entities.TransportStation;

import java.util.List;

public interface TransportStationRepositoryCustom {
    List<TransportStation> findNearbyStations(double latitude, double longitude, double distance);
    List<TransportStation> findStationsWithinPolygon(String polygonWkt);
}
