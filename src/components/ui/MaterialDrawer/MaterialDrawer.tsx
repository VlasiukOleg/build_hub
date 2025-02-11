import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  useDisclosure,
  Image,
  Link,
  Tooltip,
  Avatar,
  AvatarGroup,
} from '@heroui/react';
import { title } from 'process';

import { FaCircleInfo } from 'react-icons/fa6';
import { MdOutlineClose } from 'react-icons/md';

interface IMaterialDrawerProps {
  title: String;
  description: String;
  image: string;
  officialLink: string;
}

const MaterialDrawer: React.FC<IMaterialDrawerProps> = ({
  title,
  description,
  image,
  officialLink,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        color="primary"
        isIconOnly
        size="sm"
        className="text-xs md:text-sm xl:text-base"
        variant="flat"
        onPress={onOpen}
      >
        <FaCircleInfo size={16} />
      </Button>
      <Drawer
        hideCloseButton
        backdrop="blur"
        classNames={{
          base: 'data-[placement=right]:sm:m-2 data-[placement=left]:sm:m-2  rounded-medium',
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DrawerContent>
          {onClose => (
            <>
              <DrawerHeader className="absolute top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between bg-content1/50 backdrop-saturate-150 backdrop-blur-lg">
                <Tooltip content="Закрити">
                  <Button
                    isIconOnly
                    className="text-default-400"
                    size="sm"
                    variant="light"
                    onPress={onClose}
                  >
                    <MdOutlineClose size={20} />
                  </Button>
                </Tooltip>
              </DrawerHeader>
              <DrawerBody className="pt-16">
                <div className="flex w-full justify-center items-center">
                  <Image
                    isBlurred
                    isZoomed
                    alt="Event image"
                    className="aspect-square w-full hover:scale-110 cursor-pointer"
                    height={150}
                    src={image}
                  />
                </div>
                <div className="flex flex-col gap-2 py-4">
                  <h1 className="text-lg md:text-xl font-bold">{title}</h1>
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="flex flex-col gap-3 items-start">
                      <span className="text-medium md:text-lg font-medium">
                        Опис
                      </span>
                      <div className="text-xs md:text-base/5 text-default-500 flex flex-col gap-2">
                        <p>{description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DrawerBody>
              <DrawerFooter className="justify-start">
                {officialLink && (
                  <Link
                    href={officialLink}
                    size="sm"
                    color="primary"
                    isExternal
                  >
                    Офіційна сторінка
                  </Link>
                )}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MaterialDrawer;
