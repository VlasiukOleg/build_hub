'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCity } from '@/redux/citySlice';

interface ICityInitializerProps {
  city: string;
}

const CityInitializer: React.FC<ICityInitializerProps> = ({ city }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCity(city));
  }, [city, dispatch]);

  return null;
};

export default CityInitializer;
