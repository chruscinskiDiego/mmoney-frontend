import { useEffect, useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Input,
    Spinner,
} from "@chakra-ui/react";
import { SucessMessage } from "../../alerts/SucessMessage";
import { ErrorMessage } from "../../alerts/ErrorMessage";
import { api } from '../../lib/axios';
import { InfoMessage } from "../../alerts/InfoMessage";


export const EditCategoryModal = ({ isOpen, onClose, selectedCategory, onSave }: any) => {
    const [category, setCategory] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        if (selectedCategory) {
            setCategory(selectedCategory.name);
        }
    }, [selectedCategory]);

    const handleSubmit = async () => {

        if (!category) {
            InfoMessage("Preencha o nome da categoria!");
            return;
        }

        try {

            setSubmitLoading(true);

            const payload = {
                name: category,
            };

            const response = await api.put(
                `${import.meta.env.VITE_SERVER_ADDRESS}/categories/update/${selectedCategory.id}`,
                payload
            );

            if (response.status === 200) {
                SucessMessage("Categoria editada com sucesso.");
                setSubmitLoading(false);
                onClose();
                onSave();
            } else {
                ErrorMessage("Erro ao editar categoria.");
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
                    mb={3}
                >
                    Editar Categoria
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel color={"#8cff9a"}>Nome</FormLabel>
                        <Input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            bg="white"
                            focusBorderColor="#8cff9a"
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
};
