import { useAppSelector } from '@/redux/hooks';

interface IAccordionItemAdditionalSubTitle {}

const AccordionItemAdditionalSubTitle: React.FC<
  IAccordionItemAdditionalSubTitle
> = () => {
  const additionalMaterialList = useAppSelector(
    state => state.additionalMaterial.additionalMaterial
  );

  const totalSelectedAdditionalaterialsCount = additionalMaterialList.length;

  return (
    <>
      {totalSelectedAdditionalaterialsCount > 0 && (
        <div className="flex items-center justify-center absolute top-[-6px] right-[-8px] w-5 h-5 rounded-xl text-white  bg-red-400 text-xs xl:size-6 xl:text-sm">
          {totalSelectedAdditionalaterialsCount}
        </div>
      )}
    </>
  );
};

export default AccordionItemAdditionalSubTitle;
