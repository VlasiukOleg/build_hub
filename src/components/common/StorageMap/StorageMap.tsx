'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@heroui/react';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const Modal = dynamic(() => import('@/components/ui/Modal'));
import ButtonLink from '@/components/ui/ButtonLink';
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

const storages = [
  {
    id: 1,
    location: 'СКЛАД №1',
    coordinates: [50.4851, 30.4725] as [number, number], // Координаты для "Марка Вовчка"
  },
  {
    id: 2,
    location: 'СКЛАД №2',
    coordinates: [50.4594, 30.6008] as [number, number], // Координаты для "Деревообробна"
  },
  {
    id: 3,
    location: 'СКЛАД №3',
    coordinates: [50.4547, 30.3658] as [number, number], // Координаты для "Пр. Перемоги 67"
  },
  {
    id: 4,
    location: 'СКЛАД №4',
    coordinates: [50.4022, 30.6397] as [number, number], // Координаты для "Бориспольска 14"
  },
];

const position: [number, number] = [50.4501, 30.5234];

const StorageMap: React.FC<IStorageMapProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');

  const router = useRouter();
  const dispatch = useAppDispatch();

  const deliveryType = useAppSelector(state => state.delivery.deliveryType);
  const deliveryStorage = useAppSelector(
    state => state.delivery.deliveryStorage
  );
  console.log(deliveryStorage);

  const handleStorageClick = (location: string) => {
    setIsOpen(true);
    setSelectedStore(location);
  };

  const handleDeliveryType = (deliveryType: string) => {
    dispatch(setDeliveryStorage(selectedStore));
    dispatch(setDeliveryType(deliveryType));
    setIsOpen(false);
  };

  return (
    <section className="py-5 md:py-10 text-center">
      <h1 className="font-unbounded xl:text-2xl font-bold text-center mb-5 md:mb-10 md:text-lg">
        Оберіть найближчий до Вас склад завантаження
      </h1>
      <MapContainer
        center={position}
        zoom={11}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {storages.map(storage => (
          <Marker
            key={storage.id}
            position={storage.coordinates}
            icon={markerIcon}
          >
            <Popup>
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

      <ButtonLink
        variant="main"
        onClick={() => router.push('/catalog/')}
        disabled={deliveryType === ''}
      >
        Продовжити
      </ButtonLink>
      <Modal isOpen={isOpen} close={() => setIsOpen(false)}>
        <DeliveryTypeChoice
          selectedStore={selectedStore}
          handleDeliveryType={handleDeliveryType}
        />
      </Modal>
    </section>
  );
};

export default StorageMap;
