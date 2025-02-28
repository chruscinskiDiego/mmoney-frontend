import { useCallback, useContext, useEffect, useState } from "react";
import { api } from '../../lib/axios';
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
  HStack,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { AppContext } from "../../contexts/AppContext";
import { SucessMessage } from "../../alerts/SucessMessage";
import { ErrorMessage } from "../../alerts/ErrorMessage";
import { InfoMessage } from "../../alerts/InfoMessage";

const AddExpenseModal = ({ isOpen, onClose }: any) => {
  const [amount, setAmount] = useState("");
  const [observation, setObservation] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");
  const [situation, setSituation] = useState("");
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { user } = useContext(AppContext);
  const [submitLoading, setSubmitLoading] = useState(false);

  const getCategories = useCallback(async () => {
    try {
      const response = await api.get(`${import.meta.env.VITE_SERVER_ADDRESS}/categories/user/${user}`);
      setCategories(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      setCategories([]);
    }
  }, [user]);

  const getAccounts = useCallback(async () => {

    try {
      const response = await api.get(`${import.meta.env.VITE_SERVER_ADDRESS}/bank-accounts/user/${user}`);
      setAccounts(response.data);
    } catch (error) {
      console.error("Erro ao buscar contas bancárias:", error);
      setAccounts([]);
    }

  }, [user]);

  useEffect(() => {
    getCategories();
    getAccounts();

  }, []);

  const handleSubmit = async () => {

    if (!amount || !date || !category || !account || !situation) {
      InfoMessage("Preencha os campos!");
      return;
    }
    try {

      setSubmitLoading(true);

      const payload = {
        value: parseFloat(amount),
        situation,
        obs: observation,
        date,
        userEmail: user,
        categoryId: category,
        bankAccountId: account,
      };

      const response = await api.post(`${import.meta.env.VITE_SERVER_ADDRESS}/expenses/create`, payload);

      if (response.status === 200) {

        SucessMessage("Despesa adicionada com sucesso!");
        setSubmitLoading(false);
        setAmount("");
        setAccount("");
        setCategory("");
        setDate("");
        setObservation("");
        setSituation("");
        onClose();

      } else {
        setSubmitLoading(false);
        ErrorMessage("Erro ao adicionar despesa.");
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
          Nova Despesa
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {/* Campo Valor */}
          <FormControl isRequired mb={4}>
            <FormLabel color={"#8cff9a"}>Valor (R$)</FormLabel>
            <Input
              type="text"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9.,]/g, "");
                setAmount(rawValue);
              }}
              bg="white"
              focusBorderColor="#8cff9a"
            />
          </FormControl>



          {/* Campo Data */}
          <HStack spacing={4} mb={4}>
            <Box flex="1">
              <FormControl isRequired mb={4}>
                <FormLabel color={"#8cff9a"}>Data</FormLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  bg="white"
                  focusBorderColor="#8cff9a" // Personalizando a cor ao focar
                />
              </FormControl>
            </Box>

            <Box flex="1">
              <FormControl isRequired mb={4}>
                <FormLabel color={"#8cff9a"}>Situação</FormLabel>
                <Select
                  placeholder="Selecione a situação"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  bg="white"
                  focusBorderColor="#8cff9a" // Personalizando a cor ao focar
                >
                  <option value="P">Pendente</option>
                  <option value="Q">Quitada</option>
                </Select>
              </FormControl>
            </Box>
          </HStack>

          {/* Agrupando Categoria e Banco lado a lado */}
          <HStack spacing={4} mb={4}>
            <Box flex="1">
              <FormControl isRequired>
                <FormLabel color={"#8cff9a"}>Categoria</FormLabel>
                <Select
                  placeholder="Selecione uma categoria"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  bg="white"
                  focusBorderColor="#8cff9a" // Personalizando a cor ao focar
                >
                  {categories?.map((category: any) => (
                    <option key={category.id} value={category.id} className="custom-option">
                      {category.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box flex="1">
              <FormControl isRequired>
                <FormLabel color={"#8cff9a"}>Conta Bancária</FormLabel>
                <Select
                  placeholder="Selecione um banco"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  bg="white"
                  focusBorderColor="#8cff9a"
                >
                  {accounts?.map((account: any) => (
                    <option key={account.id} value={account.id}>
                      {account.number}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </HStack>

          {/* Campo Observação */}
          <FormControl mb={4}>
            <FormLabel color={"#8cff9a"}>Observação</FormLabel>
            <Input
              type="text"
              placeholder="Digite uma observação"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
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

export default AddExpenseModal;
