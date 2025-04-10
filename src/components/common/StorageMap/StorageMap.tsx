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

import { FaRegEdit } from 'react-icons/fa';

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
  const isMovingPriceAddToOrderBar = useAppSelector(
    state => state.moving.isMovingPriceAddToOrder
  );

  const popupElRef = useRef<any>(null);

  const handleStorageClick = (location: string) => {
    onOpen();
    setSelectedStore(location);
    if (popupElRef.current) {
      popupElRef.current._closeButton.click();
    }
  };

  const handleDeliveryType = () => {
    dispatch(setDeliveryStorage(selectedStore));
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
          height: '350px',
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
                className="p-2 text-xs h-7 md:text-sm md:h-8"
                onPress={() => handleStorageClick(storage.location)}
                radius="sm"
              >
                Вибрати
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      {deliveryStorage && (
        <div className="flex flex-col gap-2 text-xs mb-5 md:text-base xl:text-xl">
          <div>
            <span className="font-semibold">Склад: </span> {deliveryStorage}
          </div>
          <div className="">
            <span className="font-semibold">Тип доставки: </span>
            <span>
              {deliveryType === 'delivery'
                ? 'Доставка до об’єкта'
                : 'Cамовивіз зі складу'}
            </span>
          </div>
          <div>
            <span className="font-semibold">Послуга розвантаження: </span>
            <span>
              {isMovingPriceAddToOrderBar ? 'Вантажники' : 'Без розвантаження'}
            </span>
          </div>
        </div>
      )}

      <Button
        onPress={() => router.push('/catalog')}
        className="bg-accent text-white  font-medium text-sm md:text-base h-10 xl:text-lg xl:h-12"
        radius="sm"
        isDisabled={deliveryType === ''}
      >
        Продовжити
      </Button>
      {!deliveryType && (
        <Button
          onPress={() => router.push('/catalog')}
          className="bg-accent text-white ml-3   text-sm md:text-base font-medium text-base h-10 xl:text-lg xl:h-12"
          radius="sm"
        >
          Пропустити
        </Button>
      )}
      <ModalHeroUi
        title={selectedStore}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onAction={handleDeliveryType}
        withActions
        submitButtonTitle="Продовжити"
        onlySubmit
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
