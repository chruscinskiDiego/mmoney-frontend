import { InfoMessage } from "../../alerts/InfoMessage";
import { ErrorMessage } from "../../alerts/ErrorMessage";
import { SucessMessage } from "../../alerts/SucessMessage";
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { api } from '../../lib/axios';
export const EditBankModal = ({ isOpen, onClose, selectedBank, onSave }: any) => {
    const [bank, setBank] = useState("");
    const [code, setCode] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (selectedBank) {
            setBank(selectedBank.name);
            setCode(selectedBank.code);
        }
    }, [selectedBank]);

    const handleSubmit = async () => {

        if (!bank) {
            InfoMessage("Preencha o nome do banco!");
            return;
        }

        try {

            setSubmitLoading(true);

            const payload = {
                name: bank,
                code: code,
            };

            const response = await api.put(
                `${import.meta.env.VITE_SERVER_ADDRESS}/banks/update/${selectedBank.id}`,
                payload
            );

            if (response.status === 200) {
                SucessMessage("Banco editado com sucesso.");
                setSubmitLoading(false);
                onClose();
                onSave();
            } else {
                ErrorMessage("Erro ao editar banco.");
                setSubmitLoading(false);
            }
        } catch (error) {
            console.error("Erro ao enviar dados:", error);
            ErrorMessage("Erro ao enviar dados para o servidor!");
            setSubmitLoading(false);
        }
    };

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
                >
                    Editar Banco
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Nome do Banco</FormLabel>
                        <Input
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            placeholder="Nome do banco"
                        />
                        <FormLabel>Código do Banco</FormLabel>
                        <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Código do banco"
                        />
                    </FormControl>
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
                        disabled={submitLoading}
                        background={"#8cff9a"}
                        onClick={handleSubmit}
                        ml={3}
                        px={6}
                        borderRadius="sm"
                        _hover={{
                            transform: "scale(1.04)",
                            transition: "transform 0.2s ease-in-out",
                        }}
                    >
                        {submitLoading ? <Spinner size="sm" /> : "Salvar"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}