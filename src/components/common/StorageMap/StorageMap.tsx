'use client';

import React, { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button, useDisclosure } from '@heroui/react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { useMap } from 'react-leaflet/hooks';
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
    location: 'Склад Пріорка',
    coordinates: [50.50242, 30.46328], // Координаты для "Марка Вовчка"
  },
  {
    id: 2,
    location: 'Склад Видубичі',
    coordinates: [50.4103888, 30.5737023], // Координаты для "Деревообробна"
  },
  {
    id: 3,
    location: 'Склад Перемоги',
    coordinates: [50.449714919, 30.399614326], // Координаты для "Пр. Перемоги 67"
  },
  {
    id: 4,
    location: 'Склад Бориспільська',
    coordinates: [50.43014, 30.66100], // Координаты для "Бориспольска 14"
  },
  {
    id:5,
    location: 'Склад Берковецька',
    coordinates: [50.49336, 30.34126], // Координаты для Берковецька
  }
];

const ResetViewControl = ({ position }: { position: LatLngTuple }) => {
  const map = useMap();

  return (
    <div className="leaflet-bottom leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <a
          href="#"
          title="Повернути до початкового положення"
          onClick={e => {
            e.preventDefault();
            map.flyTo(position, 10);
          }}
          style={{
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a.5.5 0 0 1 .5.5V3a.5.5 0 0 1-1 0V1.5A.5.5 0 0 1 8 1z" />
            <path d="M8 13a.5.5 0 0 1 .5.5V15a.5.5 0 0 1-1 0v-1.5a.5.5 0 0 1 .5-.5z" />
            <path d="M1 8a.5.5 0 0 1 .5-.5H3a.5.5 0 0 1 0 1H1.5A.5.5 0 0 1 1 8z" />
            <path d="M13 8a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1h-1.5A.5.5 0 0 1 13 8z" />
            <path d="M8 4a4 4 0 1 1 0 8A4 4 0 0 1 8 4z" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const position: LatLngTuple = [50.4501, 30.5234];

const StorageMap: React.FC<IStorageMapProps> = () => {
  // const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const router = useRouter();
  const searchParams = useSearchParams();
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

  const from = searchParams.get('from');

  const handleSkipClick = () => {
    if (from) {
      router.push(`/${from}`);
    } else {
      router.push('/catalog');
    }
  };

  const handleNextClick: () => void = () => {
    if (from) {
      router.push(`/${from}`);
    } else {
      router.push('/catalog');
    }
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
        <ResetViewControl position={position} />
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
              <div className="flex flex-col justify-center items-center">
                <div className="text-center text-[10px] md:text-[12px] xl:text-base mb-2">
                  {storage.location}
                </div>
                <Button
                  color="primary"
                  className="p-2 text-xs h-7 md:text-sm md:h-8"
                  onPress={() => handleStorageClick(storage.location)}
                  radius="sm"
                >
                  Вибрати
                </Button>
              </div>
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
        onPress={handleNextClick}
        className="bg-accent text-white  font-medium text-sm md:text-base h-10 xl:text-lg xl:h-12"
        radius="sm"
        isDisabled={deliveryStorage === ''}
      >
        Продовжити
      </Button>
      {!deliveryStorage && (
        <Button
          onPress={handleSkipClick}
          className="bg-accent text-white ml-3 text-sm md:text-base font-medium  h-10 xl:text-lg xl:h-12"
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
