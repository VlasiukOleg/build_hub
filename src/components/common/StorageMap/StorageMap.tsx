'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button, useDisclosure } from '@heroui/react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const ModalHeroUi = dynamic(() => import('@/components/ui/ModalHeroUi'));
import DeliveryTypeChoice from '@/components/ui/DeliveryTypeChoice/DeliveryTypeChoice';

import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setDeliveryType, setDeliveryStorage } from '@/redux/deliverySlice';

interface IStorageMapProps {}

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

const redMarkerIcon = new L.Icon({
  iconUrl: 'https://imgur.com/WML5caD.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [40, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Storage {
  id: number;
  location: string;
  coordinates: LatLngTuple;
}

const storages: Storage[] = [
  {
    id: 1,
    location: 'СКЛАД №1',
    coordinates: [50.4851, 30.4725], // Координаты для "Марка Вовчка"
  },
  {
    id: 2,
    location: 'СКЛАД №2',
    coordinates: [50.410518843136686, 30.573064197158324], // Координаты для "Деревообробна"
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

const position: LatLngTuple = [50.4501, 30.5234];

const StorageMap: React.FC<IStorageMapProps> = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );

  const popupElRef = useRef<any>(null);

  const handleStorageClick = (location: string) => {
    onOpen();
    setSelectedStore(location);
    if (popupElRef.current) {
      popupElRef.current._closeButton.click();
    }
  };

  const handleDeliveryType = (deliveryType: string) => {
    dispatch(setDeliveryStorage(selectedStore));
    dispatch(setDeliveryType(deliveryType));
    onClose();

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  };

  return (
    <section className="py-5 md:py-8 text-center">
      <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5 md:mb-8 md:text-lg">
        Оберіть найближчий до Вас склад завантаження
      </h1>
      <MapContainer
        center={position}
        zoom={10}
        style={{
          height: '500px',
          width: '100%',
          marginBottom: '20px',
          zIndex: '40',
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {storages.map(storage => (
          <Marker
            key={storage.id}
            position={storage.coordinates}
            icon={
              deliveryStorage === storage.location ? redMarkerIcon : markerIcon
            }
          >
            <Popup ref={popupElRef}>
              <div className="text-center mb-2">{storage.location}</div>
              <Button
                color="primary"
                onPress={() => handleStorageClick(storage.location)}
              >
                Вибрати
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {deliveryStorage && (
        <ul className="flex flex-col gap-2 text-sm mb-5 md:text-base xl:text-xl">
          <li>Склад: {deliveryStorage}</li>
          <li>
            Тип доставки:{' '}
            {deliveryType === 'delivery'
              ? 'Доставка автотранспортом'
              : 'Cамовивіз зі складу'}
          </li>
        </ul>
      )}

      <Button
        onPress={() => router.push('/catalog')}
        className="bg-accent text-white  font-medium text-base h-10 xl:text-lg xl:h-12"
        radius="sm"
        isDisabled={deliveryType === ''}
      >
        Продовжити
      </Button>
      {!deliveryType && (
        <Button
          onPress={() => router.push('/catalog')}
          className="bg-accent text-white ml-3   font-medium text-base h-10 xl:text-lg xl:h-12"
          radius="sm"
        >
          Пропустити
        </Button>
      )}
      <ModalHeroUi
        title={selectedStore}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={() => {}}
      >
        <DeliveryTypeChoice
          selectedStore={selectedStore}
          handleDeliveryType={handleDeliveryType}
        />
      </ModalHeroUi>
    </section>
  );
};

export default StorageMap;
