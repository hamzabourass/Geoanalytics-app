import geopandas as gpd
from sqlalchemy import create_engine

# Load GeoJSON data
gdf = gpd.read_file('C:/Users/Majd/OneDrive/Bureau/Geo_data/transport_stations.geojson')

# Print first few rows to verify data, specify encoding as utf-8
print(gdf.head().to_string().encode('utf-8'))
# Create a SQLAlchemy engine
engine = create_engine('postgresql://admin:admin-root@localhost:5432/geo_db')

# Upload GeoDataFrame to PostgreSQL
try:
    gdf.to_postgis('regions', engine,if_exists='replace', index=False)
    print("Data uploaded successfully!")
except Exception as e:
    print(f"Error uploading data: {e}")
