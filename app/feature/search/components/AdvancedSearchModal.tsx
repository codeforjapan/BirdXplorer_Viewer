import "./advanced-search-modal.css";

import { Modal, ScrollArea } from "@mantine/core";

type AdvancedSearchModalProps = {
  opened: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const AdvancedSearchModal = ({
  children,
  ...rest
}: AdvancedSearchModalProps) => {
  return (
    <Modal
      centered
      scrollAreaComponent={ScrollArea.Autosize}
      withCloseButton={false}
      {...rest}
    >
      {children}
    </Modal>
  );
};
