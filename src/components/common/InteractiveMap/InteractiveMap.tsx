'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Фикс для иконок маркеров
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const storages = [
  {
    id: 1,
    location: 'СКЛАД №1',
    coordinates: [50.4851, 30.4725], // Координаты для "Марка Вовчка"
  },
  {
    id: 2,
    location: 'СКЛАД №2',
    coordinates: [50.4594, 30.6008], // Координаты для "Деревообробна"
  },
  {
    id: 3,
    location: 'СКЛАД №3',
    coordinates: [50.4547, 30.3658], // Координаты для "Пр. Перемоги 67"
  },
  {
    id: 4,
    location: 'СКЛАД №4',
    coordinates: [50.4022, 30.6397], // Координаты для "Бориспольска 14"
  },
];

const InteractiveMap = () => {
  return (
    <MapContainer
      center={[50.4501, 30.5234]} // Центр карты (Киев)
      zoom={11} // Уровень масштабирования
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {storages.map(storage => (
        <Marker
          key={storage.id}
          position={storage.coordinates}
          icon={markerIcon}
        >
          <Popup>
            <strong>{storage.location}</strong>
            <br />
            {storage.coordinates.join(', ')}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default InteractiveMap;
