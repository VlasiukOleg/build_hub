import { getDistanceMultiplier } from '@/components/ui/Accordion/DisclosureMovingPanel/utils';

const MOVING_PRICE_CONFIG = {
  PER_TON: 600,
  PER_FLOOR: 250,
  OLD_BUILDING_PER_FLOOR: 300,
  GIPSOKARTON: {
    SM: { BASE: 25, PER_FLOOR: 15 },
    MD: { BASE: 35, PER_FLOOR: 20 },
    LG: { BASE: 40, PER_FLOOR: 30 },
  },
  PROF: {
    LG: { BASE: 2, PER_FLOOR: 1 },
    XL: { BASE: 3, PER_FLOOR: 2 },
  },
};

const calculateMovingTypeFeePerItem = (
  basePrice: number,
  perFloorPrice: number,
  floor: number,
  distanceMultiplier: number,
  elevator: string
) => {
  let fee = basePrice;
  if (floor > 1 && elevator === 'nolift') {
    fee += perFloorPrice * (floor - 1);
  }
  return fee * distanceMultiplier;
};

export const calculateMovingFee = (
  elevator: string,
  distance: number,
  building: string,
  floor: number
) => {
  const distanceMultiplier = getDistanceMultiplier(distance);

  let weightTypeMovingFee = MOVING_PRICE_CONFIG.PER_TON * distanceMultiplier;

  let gipsSmMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.GIPSOKARTON.SM.BASE,
    MOVING_PRICE_CONFIG.GIPSOKARTON.SM.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let gipsMdMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.GIPSOKARTON.MD.BASE,
    MOVING_PRICE_CONFIG.GIPSOKARTON.MD.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let gipsLgMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.GIPSOKARTON.LG.BASE,
    MOVING_PRICE_CONFIG.GIPSOKARTON.LG.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let profLgMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.PROF.LG.BASE,
    MOVING_PRICE_CONFIG.PROF.LG.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let profXlMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.PROF.XL.BASE,
    MOVING_PRICE_CONFIG.PROF.XL.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  if (elevator === 'passenger') {
    weightTypeMovingFee *= 1.15;
    gipsSmMovingFee *= 1.15;
    profLgMovingFee *= 1.2;
  }

  const movingPricePerFloorByBuilding =
    building === 'old'
      ? MOVING_PRICE_CONFIG.OLD_BUILDING_PER_FLOOR
      : MOVING_PRICE_CONFIG.PER_FLOOR;

  if (floor > 1 && elevator === 'nolift') {
    weightTypeMovingFee += movingPricePerFloorByBuilding * (floor - 1);
  }

  if (floor > 1 && elevator !== 'nolift') {
    gipsMdMovingFee +=
      MOVING_PRICE_CONFIG.GIPSOKARTON.MD.PER_FLOOR * (floor - 1);
    gipsLgMovingFee +=
      MOVING_PRICE_CONFIG.GIPSOKARTON.LG.PER_FLOOR * (floor - 1);
    profXlMovingFee += MOVING_PRICE_CONFIG.PROF.XL.PER_FLOOR * (floor - 1);
  }

  return {
    weightTypeMovingFee,
    gipsSmMovingFee,
    gipsMdMovingFee,
    gipsLgMovingFee,
    profLgMovingFee,
    profXlMovingFee,
  };
};
