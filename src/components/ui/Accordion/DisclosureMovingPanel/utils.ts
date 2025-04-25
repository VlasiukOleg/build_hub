import { DISTANCE_MULTIPLIERS, MAX_DISTANCE_MULTIPLIERS } from './constants';

import {
  Material,
  AdditionalMaterial,
  ConfigurableMaterial,
  MaterialSetting,
} from '@/@types';

interface ActiveMaterial {
  movingTypeCalculation: string;
  quantity: number;
  weight: number;
}

export const getDistanceMultiplier = (distance: number) => {
  for (const { maxDistance, multiplier } of DISTANCE_MULTIPLIERS) {
    if (distance <= maxDistance) {
      return multiplier;
    }
  }

  return MAX_DISTANCE_MULTIPLIERS;
};

export const getActiveMaterials = (materials: any[]) => {
  return materials
    .filter(material => material.quantity > 0)
    .map(material => ({
      movingTypeCalculation: material.movingTypeCalculation,
      quantity: material.quantity,
      weight: material.weight,
    }));
};

export const groupMaterialsByType = (materials: ActiveMaterial[]) => {
  const groupedMaterials = materials.reduce(
    (acc, material) => {
      const { movingTypeCalculation, quantity, weight } = material;
      if (!acc[movingTypeCalculation]) {
        acc[movingTypeCalculation] = { quantity: 0, totalWeight: 0 };
      }
      acc[movingTypeCalculation].quantity += quantity;
      acc[movingTypeCalculation].totalWeight += quantity * weight;

      return acc;
    },
    {} as Record<string, { quantity: number; totalWeight: number }>
  );

  return groupedMaterials;
};
