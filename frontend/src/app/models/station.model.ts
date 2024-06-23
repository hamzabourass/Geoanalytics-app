
export interface Station {
  id: number;
  osmId: number;
  code: number;
  fclass: string;
  name: string;
  geometry: {
    longitude: number;
    latitude: number;
  };
}
