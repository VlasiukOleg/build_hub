'use client';

import OpenBurgerMenuBtn from '@/components/common/OpenBurgerMenuBtn';
import { useMaterials } from '@/hooks/useMaterials';

const FixedOpenBurgerMenuBtn = () => {
  const { totalQuantity } = useMaterials();
  const isBtnVisible = Number(totalQuantity) > 0;

  return (
    <>
      {isBtnVisible && (
        <div className="sticky bottom-4 right-4 xl:hidden pr-2 text-right">
          <OpenBurgerMenuBtn totalQuantity={totalQuantity} />
        </div>
      )}
    </>
  );
};

export default FixedOpenBurgerMenuBtn;
