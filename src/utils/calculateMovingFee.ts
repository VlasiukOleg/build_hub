import { getDistanceMultiplier } from '@/components/ui/Accordion/DisclosureMovingPanel/utils';

const MOVING_PRICE_CONFIG = {
  PER_TON: 700,
  PER_FLOOR: 350,
  OLD_BUILDING_PER_FLOOR: 450,
  GIPSOKARTON: {
    SM: { BASE: 35, PER_FLOOR: 15 },
    MD: { BASE: 40, PER_FLOOR: 20 },
    LG: { BASE: 50, PER_FLOOR: 30 },
  },
  PROF: {
    LG: { BASE: 3, PER_FLOOR: 1 },
    XL: { BASE: 4.5, PER_FLOOR: 2 },
  },
  BLOCK: {
    XS: { BASE: 9, PER_FLOOR: 3 },
    SM: { BASE: 12, PER_FLOOR: 4.5 },
    MD: { BASE: 17, PER_FLOOR: 6 },
    LG: { BASE: 28, PER_FLOOR: 9 },
    XL: { BASE: 36, PER_FLOOR: 12 },
  },
  CEGLA: {
    XS: { BASE: 4, PER_FLOOR: 1.7 },
    SM: { BASE: 5, PER_FLOOR: 2 },
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

  let blockXsMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.BLOCK.XS.BASE,
    MOVING_PRICE_CONFIG.BLOCK.XS.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let blockSmMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.BLOCK.SM.BASE,
    MOVING_PRICE_CONFIG.BLOCK.SM.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let blockMdMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.BLOCK.MD.BASE,
    MOVING_PRICE_CONFIG.BLOCK.MD.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let blockLgMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.BLOCK.LG.BASE,
    MOVING_PRICE_CONFIG.BLOCK.LG.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  let blockXlMovingFee = calculateMovingTypeFeePerItem(
    MOVING_PRICE_CONFIG.BLOCK.XL.BASE,
    MOVING_PRICE_CONFIG.BLOCK.XL.PER_FLOOR,
    floor,
    distanceMultiplier,
    elevator
  );

  if (elevator === 'passenger') {
    weightTypeMovingFee *= 1.15;
    gipsSmMovingFee *= 1.15;
    profLgMovingFee *= 1.2;
    blockXsMovingFee *= 1.15;
    blockSmMovingFee *= 1.15;
    blockMdMovingFee *= 1.15;
    blockLgMovingFee *= 1.15;
    blockXlMovingFee *= 1.15;
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
    blockXsMovingFee,
    blockSmMovingFee,
    blockMdMovingFee,
    blockLgMovingFee,
    blockXlMovingFee,
  };
};
