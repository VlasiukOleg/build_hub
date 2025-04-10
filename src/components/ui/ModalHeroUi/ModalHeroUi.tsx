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
  submitButtonTitle?: string;
  cancelButtonTitle?: string;
  onlySubmit?: boolean;
}

const ModalHeroUi: React.FC<IModalHeroUi> = ({
  title,
  isOpen,
  onOpenChange,
  onAction,
  children,
  withActions,
  onlySubmit,
  submitButtonTitle = 'Так',
  cancelButtonTitle = 'Відмінити',
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
                    color="success"
                    variant="light"
                    radius="sm"
                    onPress={() => {
                      onAction(), onClose();
                    }}
                  >
                    {submitButtonTitle}
                  </Button>
                  {!onlySubmit && (
                    <Button
                      className="bg-red-300 text-bgWhite"
                      radius="sm"
                      onPress={onClose}
                    >
                      {cancelButtonTitle}
                    </Button>
                  )}
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
