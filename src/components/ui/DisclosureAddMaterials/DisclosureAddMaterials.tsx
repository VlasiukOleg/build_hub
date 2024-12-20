import { Disclosure, DisclosureButton } from '@headlessui/react';

import DisclosureAddMaterialsPanel from '../DisclosureAddMaterialsPanel/';

import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface IDisclosureAdditionalMaterialsProps {}

const DisclosureAdditionalMaterials: React.FC<
  IDisclosureAdditionalMaterialsProps
> = ({}) => {
  return (
    <Disclosure as="div" className="p-6">
      <DisclosureButton className="group flex w-full items-center justify-between">
        <div className="text-left flex gap-2 items-center">
          <div className="rounded-full bg-accent text-bgWhite size-5 flex justify-center items-center text-lg md:size-6 md:text-xl xl:size-7  ">
            +
          </div>
          <span className="text-xs/6 text-left  text-grey font-semibold group-data-[hover]:text-grey/80 md:text-base xl:text-xl">
            Додати матеріал
          </span>
        </div>
        <ChevronDownIcon className="size-5 fill-grey group-data-[hover]:fill-grey/80 group-data-[open]:rotate-180 md:size-6 xl:size-7" />
      </DisclosureButton>
      <DisclosureAddMaterialsPanel />
    </Disclosure>
  );
};

export default DisclosureAdditionalMaterials;
