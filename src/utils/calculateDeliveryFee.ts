export const calculateDeliveryFee = (weight: number) => {
  if (weight > 0 && weight <= 1500) {
    return 800;
  } else if (weight > 1500 && weight <= 2050) {
    return 1000;
  } else if (weight > 2050 && weight <= 3000) {
    return 1500;
  } else if (weight > 3000 && weight <= 5000) {
    return 1800;
  } else if (weight > 5000 && weight <= 10000) {
    return 2300;
  } else if (weight > 10000) {
    return 3400;
  } else {
    return 0;
  }
};
