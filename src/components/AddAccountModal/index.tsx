import { useCallback, useContext, useEffect, useState } from "react";
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
    Select,
    Spinner,
} from "@chakra-ui/react";
import { api } from '../../lib/axios';
import { AppContext } from "../../contexts/AppContext";
import { SucessMessage } from "../../alerts/SucessMessage";
import { InfoMessage } from "../../alerts/InfoMessage";
import { ErrorMessage } from "../../alerts/ErrorMessage";

export const AddAccountModal = ({ isOpen, onClose }: any) => {
    const [number, setNumber] = useState("");
    const [bank, setBank] = useState("");
    const [accountType, setAccountType] = useState("");
    const { user } = useContext(AppContext);
    const [bankOptions, setBankOptions] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);

    const getBanks = useCallback(async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_SERVER_ADDRESS}/banks/user/${user}`);
            setBankOptions(response.data);
        } catch (error) {
            console.error("Erro ao buscar bancos:", error);
        }
    }, [user]);

    useEffect(() => {
        getBanks();
    }, []);

    const handleSubmit = async () => {

        if (!number || !bank || !accountType) {
            InfoMessage("Preencha todos os campos.");
            return;
        }

        try {

            setSubmitLoading(true);

            const payload = {
                number,
                type: accountType,
                userEmail: user,
                bankId: bank,
            };

            const response = await api.post(`${import.meta.env.VITE_SERVER_ADDRESS}/bank-accounts/create`, payload);

            if (response.status === 200) {
                SucessMessage("Conta bancária adicionada com sucesso.");
                setSubmitLoading(false);
                onClose();
                setAccountType("");
                setBank("");
                setNumber("");
            } else {
                ErrorMessage("Erro ao adicionar conta bancária.");
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
            <ModalContent
                bg="white"
                borderRadius="md"
                boxShadow="md"
                p={4}
            >
                <ModalHeader
                    fontSize="lg"
                    fontWeight="bold"
                    color="black"
                    borderBottom="1px solid"
                    borderColor="gray.200"
                    mb={3}
                >
                    Nova Conta Bancária
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel color={"#8cff9a"}>Número</FormLabel>
                        <Input
                            type="text"
                            placeholder="Digite o número da conta bancária"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            bg="white"
                            focusBorderColor="#8cff9a"
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel color={"#8cff9a"}>Banco</FormLabel>
                        <Select
                            placeholder="Selecione o banco"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            bg="white"
                            focusBorderColor="#8cff9a"
                        >
                            {bankOptions?.map((option: any) => (
                                <option key={option.id} value={option.id}>
                                    {option.name}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel color={"#8cff9a"}>Tipo de Conta</FormLabel>
                        <Select
                            placeholder="Selecione o tipo de conta"
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                            bg="white"
                            focusBorderColor="#8cff9a"
                        >
                            <option value="poupanca">Poupança</option>
                            <option value="corrente">Conta Corrente</option>
                            <option value="salario">Conta Salário</option>
                        </Select>
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button
                        disabled={submitLoading}
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
