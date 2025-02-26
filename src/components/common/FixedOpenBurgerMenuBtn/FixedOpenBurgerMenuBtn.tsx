'use client';

import OpenBurgerMenuBtn from '@/components/common/OpenBurgerMenuBtn';
import { useMaterials } from '@/hooks/useMaterials';

const FixedOpenBurgerMenuBtn = () => {
  const { totalQuantity } = useMaterials();
  const isBtnVisible = Number(totalQuantity) > 0;

  return (
    <>
      {isBtnVisible && (
        <div className="fixed bottom-4 right-4 md:hidden">
          <OpenBurgerMenuBtn totalQuantity={totalQuantity} />
        </div>
      )}
    </>
  );
};

export default FixedOpenBurgerMenuBtn;
