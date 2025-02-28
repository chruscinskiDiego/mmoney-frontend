import { useContext, useState } from "react";
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
import { AppContext } from "../../contexts/AppContext";
import { SucessMessage } from "../../alerts/SucessMessage";
import { ErrorMessage } from "../../alerts/ErrorMessage";
import { InfoMessage } from "../../alerts/InfoMessage";
import { api } from '../../lib/axios';

export const AddBankModal = ({ isOpen, onClose }: any) => {

  const [bank, setBank] = useState("");
  const [code, setCode] = useState("");
  const { user } = useContext(AppContext);
  const [submitLoading, setSubmitLoading] = useState(false);


  const handleSubmit = async () => {

    if (!bank) {
      InfoMessage("Informe o nome do banco!");
      return;
    }

    try {

      setSubmitLoading(true);

      const payload = {
        name: bank,
        code: code,
        user: user,
      };

      console.log("Enviando dados para o backend:", payload);

      const response = await api.post(`${import.meta.env.VITE_SERVER_ADDRESS}/banks/create`, payload);

      if (response.status === 200) {
        setBank("");
        setCode("");
        SucessMessage("Banco adicionado com sucesso.");
        setSubmitLoading(false);
        onClose();
      } else {
        ErrorMessage("Erro ao adicionar banco.");
        setSubmitLoading(false);
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      ErrorMessage("Erro ao enviar dados para o servidor!");
      setSubmitLoading(false);
      setBank("");
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
          Novo Banco
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>

          {/* Campo nome do banco */}
          <FormControl mb={4}>
            <FormLabel color={"#8cff9a"}>Nome</FormLabel>
            <Input
              type="text"
              placeholder="Digite o nome do banco"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              bg="white"
              focusBorderColor="#8cff9a" // Personalizando a cor ao focar
            />
          </FormControl>

          {/* Campo nome do banco */}
          <FormControl mb={4}>
            <FormLabel color={"#8cff9a"}>Código</FormLabel>
            <Input
              type="text"
              placeholder="Digite o código do banco"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              bg="white"
              focusBorderColor="#8cff9a" // Personalizando a cor ao focar
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

