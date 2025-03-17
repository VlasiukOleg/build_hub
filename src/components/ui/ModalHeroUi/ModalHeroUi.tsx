import React, { ReactNode } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';

interface IModalHeroUi {
  title: string;
  isOpen: boolean;
  onOpenChange: () => void;
  onAction: () => void;
  children: ReactNode;
  withActions?: boolean;
}

const ModalHeroUi: React.FC<IModalHeroUi> = ({
  title,
  isOpen,
  onOpenChange,
  onAction,
  children,
  withActions,
}) => {
  return (
    <>
      <Modal
        isOpen={isOpen}
        placement="center"
        onOpenChange={onOpenChange}
        size="sm"
        className=""
        classNames={{
          wrapper: 'p-4',
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-base md:text-lg">
                {title}
              </ModalHeader>
              <ModalBody>{children}</ModalBody>
              {withActions && (
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    radius="sm"
                    onPress={() => {
                      onAction(), onClose();
                    }}
                  >
                    Так
                  </Button>
                  <Button color="primary" radius="sm" onPress={onClose}>
                    Відмінити
                  </Button>
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalHeroUi;
