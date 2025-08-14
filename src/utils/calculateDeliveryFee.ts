export const calculateDeliveryFee = (weight: number, city: string) => {
  if (weight > 0 && weight <= 1500) {
    return 900;
  } else if (weight > 1500 && weight <= 2050) {
    return city === 'kiev' ? 1000 : 900;
  } else if (weight > 2050 && weight <= 3000) {
    return city === 'kiev' ? 1500 : 1200;
  } else if (weight > 3000 && weight <= 5000) {
    return city === 'kiev' ? 1800 : 1500;
  } else if (weight > 5000 && weight <= 10000) {
    return city === 'kiev' ? 2300 : 2000;
  } else if (weight > 10000) {
    return city === 'kiev' ? 3400 : 3000;
  } else {
    return 0;
  }
};
