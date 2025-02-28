import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";


export const SureDelete = ({ isOpen, onClose, onSubmit, title, text }: any) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent bg="white" borderRadius="md" boxShadow="md" p={4}>
                <ModalHeader
                    fontSize="lg"
                    fontWeight="bold"
                    color="black"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    mb={3}
                >
                    {title}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>{text}</Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="outline"
                        borderColor={"black"}
                        color={"black"}
                        onClick={onClose}
                        px={6}
                        borderRadius="sm"
                        _hover={{
                            transform: "scale(1.04)",
                            transition: "transform 0.2s ease-in-out",
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        background={"#8cff9a"}
                        onClick={onSubmit}
                        ml={3}
                        px={6}
                        borderRadius="sm"
                        _hover={{
                            transform: "scale(1.04)",
                            transition: "transform 0.2s ease-in-out",
                        }}
                    >
                        Excluir
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
