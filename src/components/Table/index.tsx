import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  Box,
  Text,
  Input,
  Collapse,
  Icon,
  keyframes,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { IExpense } from '../../interfaces/expenses';
import { ITable } from '@/interfaces/table';
import { MdEditNote } from 'react-icons/md';
import { FaAngleUp, FaFilter, FaTrashAlt } from 'react-icons/fa';
import AddExpenseModal from '../AddExpenseModal';
import { AddButton } from '../AddButton';
import { ICategories } from '@/interfaces/categories';
import { AddCategoryModal } from '../AddCategoryModal';
import { IBanks } from '@/interfaces/banks';
import { AddBankModal } from '../AddBankModal';
import { IAccounts } from '@/interfaces/accounts';
import { AddAccountModal } from '../AddAccountModal';
import { AppContext } from '../../contexts/AppContext';
import { EditCategoryModal } from '../EditCategoryModal';
import { SureDelete } from '../SureDelete';
import { EditBankModal } from '../EditBankModal';
import { EditAccountModal } from '../EditAccountModal';
import { EditExpenseModal } from '../EditExpenseModal';
import { SucessMessage } from '../../alerts/SucessMessage';
import { ErrorMessage } from '../../alerts/ErrorMessage';
import './style.css';
import { SpinnerLoader } from '../../loaders/SpinnerLoader';
import { api } from '../../lib/axios';

export const TableComponent = ({ page }: ITable) => {

  const swingAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  50% {
    transform: rotate(10deg);
  }
  75% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(10deg);
  }
`;

  const { user } = useContext(AppContext);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  //#region Expenses

  if (page === 'expenses') {

    //estados
    const [expensesData, setExpensesData] = useState<IExpense[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<IExpense | undefined>(undefined);
    const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);
    const { user } = useContext(AppContext);
    const [initialDateFilter, setInitialDateFilter] = useState('');
    const [finalDateFilter, setFinalDateFilter] = useState('');
    const [filterCategoria, setFilterCategoria] = useState('');
    const [filterConta, setFilterConta] = useState('');
    const [situationFilter, setSituationFilter] = useState('');
    const [totalValue, setTotalValue] = useState<number>(0);

    const rowsPerPage = 7;

    //http
    const getExpenses = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/expenses/user/${user}`);
        const data = Array.isArray(response.data) ? response.data : [];
        setExpensesData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar despesas:", error);
        setExpensesData([]);
        setIsLoading(false);
      }
    }, [user]);

    const confirmDelete = async () => {
      if (expenseToDelete) {
        try {
          const response = await api.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/expenses/delete/${expenseToDelete}`);

          if (response.status === 200) {
            setExpensesData((prev) => prev.filter((item) => item.id !== expenseToDelete));
            setExpenseToDelete(null);
            setOpenDeleteModal(false);
            SucessMessage("Despesa excluída com sucesso!");
          }
          else {
            ErrorMessage("Erro ao excluir despesa!");
          }
        } catch (error) {
          ErrorMessage("Erro de comunicação com o servidor!");
        }
      }
    };

    //utilitários
    const toggleFilters = () => {
      setShowFilters((prev) => !prev);
    };

    const openModal = () => setOpenAddModal(true);

    const closeModal = () => {
      getExpenses();
      setOpenAddModal(false)
    };

    const openEditModalCard = () => setOpenEditModal(true);

    const closeEditModal = () => setOpenEditModal(false);

    const openDeleteModalCard = () => setOpenDeleteModal(true);

    const closeDeleteModal = () => setOpenDeleteModal(false);

    const handleEdit = (expense: IExpense) => {
      setSelectedExpense(expense);
      openEditModalCard();
    };

    const handleDelete = (rowId: number) => {
      setExpenseToDelete(rowId);
      openDeleteModalCard();
    };

    const totalPages = Math.ceil(expensesData.length / rowsPerPage);

    const goToNextPage = () => {
      if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    //filtros
    const paginatedData = useMemo(() => {
      let filteredData = expensesData || [];

      if (situationFilter) {
        filteredData = filteredData.filter((item: any) => item.situation === situationFilter);
      }

      if (filterCategoria) {
        filteredData = filteredData.filter(
          (item) => item.category.name?.toLowerCase().includes(filterCategoria.toLowerCase())
        );
      }

      if (filterConta) {
        filteredData = filteredData.filter(
          (item) => item.bank_account.number?.toLowerCase().includes(filterConta.toLowerCase())
        );
      }

      if (initialDateFilter) {
        filteredData = filteredData.filter((item) => {
          const itemDate = dayjs(item.date);
          const initialDate = dayjs(initialDateFilter);
          return itemDate.isSameOrAfter(initialDate, 'day');
        });
      }

      if (finalDateFilter) {
        filteredData = filteredData.filter((item) => {
          const itemDate = dayjs(item.date);
          const finalDate = dayjs(finalDateFilter);
          return itemDate.isSameOrBefore(finalDate, 'day');
        });
      }

      if (totalValue) {
        setTotalValue(filteredData.reduce((acc, item) => acc + item.value, 0));
      }

      const startIndex = currentPage * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      return filteredData.slice(startIndex, endIndex);
    }, [currentPage, expensesData, filterCategoria, filterConta, initialDateFilter, finalDateFilter, situationFilter]);

    const calculateTotalValue = () => {
      let total = 0;
      expensesData.forEach((item) => {
        total += item.value;
      });
      setTotalValue(total);
    }

    useEffect(() => {
      calculateTotalValue();
    }, [expensesData]);

    useEffect(() => {

      if (expensesData.length != 0) return;

      getExpenses();

    }, [getExpenses]);

    return (

      <>

        <AddExpenseModal
          isOpen={openAddModal}
          onClose={closeModal}
        />

        <EditExpenseModal
          isOpen={openEditModal}
          onClose={closeEditModal}
          selectedExpense={selectedExpense}
          onSave={getExpenses}
        />

        <SureDelete
          isOpen={openDeleteModal}
          onClose={() => {
            setExpenseToDelete(null);
            closeDeleteModal();
          }}
          onSubmit={confirmDelete}
          title="Excluir Despesa"
          text="Você tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita."
        />

        {isLoading ? <SpinnerLoader /> :
          <Box p={4} bg="white" boxShadow="sm" borderRadius="md">

            <Text fontSize="xl" fontWeight="semibold" mb={3} color="gray.700">
              Despesas
            </Text>

            <Box display={"flex"} justifyContent="space-between" width={"90%"}>

              <Box
                alignContent={"center"}
                alignItems={"center"}
                _hover={{
                  transform: "scale(1.04)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <AddButton
                    text="Adicionar Despesa"
                    onClick={openModal}
                  />

                </Flex>
              </Box>

              <Box>

                <Button colorScheme="gray" mb={3} onClick={toggleFilters} size="sm" >

                  {showFilters ? <Icon fontSize={"15px"} as={FaAngleUp} /> : <Icon fontSize={"15px"} as={FaFilter} />}

                </Button>

              </Box>

            </Box>

            <Collapse in={showFilters}>

              <Flex gap={3} mb={4} width={"90%"}>


                {/*<Select
                placeholder="Situação"
                value={situationFilter}
                onChange={(e) => setSituationFilter(e.target.value)}
                bg="white"
                focusBorderColor="#8cff9a"
                style={{ height: '32px', fontSize: '14px', color: 'gray' }}
                _hover={{
                  bg: "gray.100", // Cor de fundo do Select ao passar o mouse
                }}
              >
                <option value="P">Pendente</option>
                <option value="Q">Quitada</option>

              </Select>*/}

                <Menu>
                  <MenuButton
                    as={Button}
                    bg="white"
                    border="1px solid rgb(226, 226, 226)"
                    height="32px"
                    width="300px"
                    fontSize="14px"
                    color="gray"
                    fontWeight={400}
                    _hover={{
                      bg: "gray.100",
                    }}
                    _active={{
                      bg: "white",
                      border: "2px solid #8cff9a"
                    }}
                  >
                    <Flex>
                      {!situationFilter ? 'Situação' : situationFilter === 'P' ? 'Pendente' : 'Quitada'}
                    </Flex>
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      _hover={{ bg: "#8cff9a" }}
                      onClick={() => setSituationFilter("P")}
                    >
                      Pendente
                    </MenuItem>
                    <MenuItem
                      _hover={{ bg: "#8cff9a" }}
                      onClick={() => setSituationFilter("Q")}
                    >
                      Quitada
                    </MenuItem>
                    <MenuItem
                      _hover={{ bg: "#8cff9a" }}
                      onClick={() => setSituationFilter("")}
                    >
                      Remover
                    </MenuItem>
                  </MenuList>
                </Menu>

                <Input
                  placeholder="Categoria"
                  value={filterCategoria}
                  onChange={(e) => setFilterCategoria(e.target.value)}
                  style={{ borderRadius: '5px' }}
                  size="sm"
                  focusBorderColor="#8cff9a"
                />

                <Input
                  placeholder="Conta Bancária"
                  value={filterConta}
                  onChange={(e) => setFilterConta(e.target.value)}
                  style={{ borderRadius: '5px' }}
                  size="sm"
                  focusBorderColor="#8cff9a"
                />

                <Input
                  type="date"
                  value={initialDateFilter}
                  onChange={(e) => setInitialDateFilter(e.target.value)}
                  bg="white"
                  color={"gray"}
                  focusBorderColor="#8cff9a"
                  size="sm"
                  style={{ borderRadius: '5px' }}
                  placeholder="Data Inicial"
                />

                <Input
                  type="date"
                  value={finalDateFilter}
                  onChange={(e) => setFinalDateFilter(e.target.value)}
                  bg="white"
                  color={"gray"}
                  focusBorderColor="#8cff9a"
                  size="sm"
                  style={{ borderRadius: '5px' }}
                  placeholder="Data Final"
                />


              </Flex>

            </Collapse>

            <Table variant="simple" colorScheme="gray">

              <Thead>

                <Tr>
                  <Th>Valor</Th>
                  <Th textAlign={"center"}>Situação</Th>
                  <Th textAlign={"center"}>Data</Th>
                  <Th>Categoria</Th>
                  <Th>Conta</Th>
                  <Th>Observação</Th>
                  <Th>Ações</Th>
                </Tr>

              </Thead>

              <Tbody>

                {paginatedData.map((item) => (
                  <Tr key={item.id}>

                    <Td>R$ {item.value ? item.value.toFixed(2) : '0.00'}</Td>

                    <Td>
                      <Center>
                        <Text
                          background={item.situation === 'P' ? "#fff6b5" : "#8cff9a"}
                          textAlign={"center"}
                          borderRadius={"10px"}
                          width={"80%"}
                          color={item.situation === 'P' ? "#969009" : "#009505"}
                        >
                          {item.situation === 'P' ? 'Pendente' : 'Quitada'}
                        </Text>
                      </Center>
                    </Td>
                    <Td textAlign={"center"}>{new Date(item.date).toLocaleDateString()}</Td>
                    <Td>{item.category?.name || 'N/A'}</Td>
                    <Td>{item.bank_account?.number || 'N/A'}</Td>
                    <Td style={{ maxWidth: '100px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.obs}
                    </Td>

                    <Td>

                      <Button
                        colorScheme="gray"
                        size="sm"
                        _hover={{
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleEdit(item)}>
                        <Icon fontSize={"20px"} as={MdEditNote}
                          _hover={{
                            animation: `${swingAnimation} 0.3s ease-in-out`,
                          }} />
                      </Button>

                      <Button
                        background={"black"}
                        size="sm"
                        ml={2}
                        _hover={{
                          background: "black",
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >

                        <Icon color={"white"} fontSize={"13px"} as={FaTrashAlt} _hover={{
                          animation: `${swingAnimation} 0.3s ease-in-out`,
                        }} />

                      </Button>

                    </Td>
                  </Tr>
                ))}
              </Tbody>

            </Table>



            <Flex justify="space-between" mt={4} width={"90%"}>

              {expensesData.length > 7 &&
                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 0}
                  leftIcon={<BiChevronLeft />}
                />
              }

              <Box
                flex={1}
                display="flex"
                justifyContent={"center"}
              >
                <Text fontSize="md" color="gray.700" fontWeight="semibold">
                  Total: R$ {totalValue.toFixed(2)}
                </Text>
              </Box>

              {expensesData.length > 7 &&
                <Button
                  onClick={goToNextPage}
                  isDisabled={currentPage >= totalPages - 1}
                  rightIcon={<BiChevronRight />}
                />
              }

            </Flex>




          </Box>
        }

      </>

    );

  }

  //#region Categories
  else if (page === 'categories') {

    //estados
    const [categoryData, setCategoryData] = useState<ICategories[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<ICategories | undefined>(undefined);
    const [filterName, setFilterName] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const rowsPerPage = 7;

    //http
    const getCategories = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/categories/user/${user}`);
        const data = response.data;

        if (data && Array.isArray(data)) {
          setCategoryData(data);
          setIsLoading(false);
        } else {
          console.warn("Categorias retornaram como null ou formato inválido.");
          setCategoryData([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setCategoryData([]);
        setIsLoading(false);
      }
    }, [user]);

    const confirmDelete = async () => {
      if (categoryToDelete) {
        try {
          await api.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/categories/delete/${categoryToDelete}`);

          setCategoryData((prev) => prev.filter((item) => item.id !== categoryToDelete));
          setCategoryToDelete(null);
          setOpenDeleteModal(false);
          SucessMessage('Categoria excluída com sucesso!');
        } catch (error) {
          ErrorMessage('Essa categoria possui vínculo com despesa(s).');
          setCategoryToDelete(null);
          setOpenDeleteModal(false);
        }
      }
    };

    //utilitárias
    const toggleFilters = () => {
      setShowFilters((prev) => !prev);
    };

    const openModal = () => setOpenAddModal(true);

    const openEditModalCard = () => setOpenEditModal(true);

    const closeAddModal = () => {

      getCategories();
      setOpenAddModal(false);

    }

    const closeEditModal = () => setOpenEditModal(false);

    const openDeleteModalCard = () => setOpenDeleteModal(true);

    const closeDeleteModal = () => setOpenDeleteModal(false);

    const handleEdit = (category: ICategories) => {
      setSelectedCategory(category);
      openEditModalCard();
    };

    const handleDelete = (rowId: string) => {
      setCategoryToDelete(rowId);
      openDeleteModalCard();
    };

    const totalPages = Math.ceil(categoryData.length / rowsPerPage);

    const goToNextPage = () => {
      if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    //filtros
    const paginatedData = useMemo(() => {
      let filteredData = categoryData;

      if (filterName) {
        filteredData = filteredData.filter((item) =>
          item.name.toLowerCase().includes(filterName.toLowerCase())
        );
      }

      const startIndex = currentPage * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      return filteredData?.slice(startIndex, endIndex);
    }, [currentPage, categoryData, filterName]);

    useEffect(() => {
      if (categoryData.length != 0) return;

      getCategories();

    }, [getCategories]);

    return (
      <>

        <AddCategoryModal
          isOpen={openAddModal}
          onClose={closeAddModal}
        />

        <EditCategoryModal
          isOpen={openEditModal}
          onClose={closeEditModal}
          selectedCategory={selectedCategory}
          onSave={getCategories}
        />

        <SureDelete
          isOpen={openDeleteModal}
          onClose={() => {
            setCategoryToDelete(null);
            closeDeleteModal();
          }}
          onSubmit={confirmDelete}
          title="Excluir Categoria"
          text="Você tem certeza que deseja excluir esta categoria? Esta ação não pode ser desfeita."
        />

        {isLoading ? <SpinnerLoader /> :
          <Box p={4} bg="white" boxShadow="sm" borderRadius="md">

            <Text fontSize="xl" fontWeight="semibold" mb={3} color="gray.700">
              Categorias
            </Text>

            <Box display="flex" justifyContent="space-between" width="90%">

              <Box
                alignContent="center"
                alignItems="center"
                _hover={{
                  transform: "scale(1.04)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <AddButton text="Adicionar Categoria" onClick={openModal} />

              </Box>

              <Box>

                <Button colorScheme="gray" mb={3} onClick={toggleFilters} size="sm">
                  {showFilters ? (
                    <Icon fontSize="15px" as={FaAngleUp} />
                  ) : (
                    <Icon fontSize="15px" as={FaFilter} />
                  )}
                </Button>

              </Box>
            </Box>

            <Collapse in={showFilters}>

              <Flex gap={3} mb={4} width="90%">
                <Input
                  placeholder="Nome"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  size="sm"
                  focusBorderColor="#8cff9a"
                  style={{ borderRadius: '5px', width: '50%' }}
                />
              </Flex>

            </Collapse>

            <Table variant="simple" colorScheme="gray">

              <Thead>
                <Tr>
                  <Th width={"84.3%"}>Nome</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>

              <Tbody>

                {paginatedData.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>
                      <Button
                        colorScheme="gray"
                        size="sm"
                        _hover={{
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleEdit(item)}
                      >
                        <Icon fontSize="20px" as={MdEditNote} />
                      </Button>
                      <Button
                        background="black"
                        size="sm"
                        ml={2}
                        _hover={{
                          background: "black",
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon color="white" fontSize="13px" as={FaTrashAlt} />
                      </Button>
                    </Td>
                  </Tr>
                ))}

              </Tbody>

            </Table>

            {categoryData.length > 7 &&
              <Flex justify="space-between" mt={4} width="90%">

                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 0}
                  leftIcon={<BiChevronLeft />}
                ></Button>

                <Button
                  onClick={goToNextPage}
                  isDisabled={currentPage >= totalPages - 1}
                  rightIcon={<BiChevronRight />}
                ></Button>

              </Flex>
            }

          </Box>
        }

      </>

    );

  }

  // #region Accounts
  else if (page === 'accounts') {

    //estados
    const [accounts, setAccounts] = useState<IAccounts[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<IAccounts | undefined>(undefined);
    const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
    const [numberFilter, setNumberFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const rowsPerPage = 7;

    //http
    const getAccounts = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/bank-accounts/user/${user}`);
        const data = response.data;

        if (data && Array.isArray(data)) {
          setAccounts(data);
          setIsLoading(false);
        } else {
          console.warn("Categorias retornaram como null ou formato inválido.");
          setAccounts([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setAccounts([]);
        setIsLoading(false);
      }
    }, [user]);

    const confirmDelete = async () => {
      if (accountToDelete) {
        try {
          await api.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/bank-accounts/delete/${accountToDelete}`);
          setAccounts((prev) => prev.filter((item) => item.id !== accountToDelete));
          setAccountToDelete(null);
          setOpenDeleteModal(false);
          SucessMessage('Conta excluída com sucesso!');
        } catch (error) {
          ErrorMessage('Essa conta possui vínculo com despesa(s).');
          setAccountToDelete(null);
          setOpenDeleteModal(false);
        }
      }
    };

    //utilitárias
    const toggleFilters = () => {
      setShowFilters((prev) => !prev);
    };

    const openModal = () => setOpenAddModal(true);
    const closeAddModal = () => {
      getAccounts();
      setOpenAddModal(false);
    }

    const openEditModalCard = () => setOpenEditModal(true);

    const closeEditModal = () => setOpenEditModal(false);

    const openDeleteModalCard = () => setOpenDeleteModal(true);

    const closeDeleteModal = () => setOpenDeleteModal(false);

    const handleEdit = (account: IAccounts) => {
      setSelectedAccount(account);
      openEditModalCard();
    };

    const handleDelete = (rowId: string) => {
      setAccountToDelete(rowId);
      openDeleteModalCard();
    };

    //filtros
    const paginatedData = useMemo(() => {
      let filteredData = accounts;

      if (numberFilter) {
        filteredData = filteredData.filter((item) =>
          item.number.toLowerCase().includes(numberFilter.toLowerCase())
        );
      }

      if (nameFilter) {
        filteredData = filteredData.filter((item: any) =>
          item.fk_bank?.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      const startIndex = currentPage * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      return filteredData.slice(startIndex, endIndex);
    }, [currentPage, accounts, numberFilter, nameFilter]);

    const totalPages = Math.ceil(accounts.length / rowsPerPage);

    const goToNextPage = () => {
      if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    useEffect(() => {

      if (accounts.length != 0) return;

      getAccounts();
    }, [getAccounts]);

    return (
      <>

        <AddAccountModal isOpen={openAddModal} onClose={closeAddModal} />

        <EditAccountModal
          isOpen={openEditModal}
          onClose={closeEditModal}
          selectedAccount={selectedAccount}
          onSave={getAccounts}
        />

        <SureDelete
          isOpen={openDeleteModal}
          onClose={() => {
            setAccountToDelete(null);
            closeDeleteModal();
          }}
          onSubmit={confirmDelete}
          title="Excluir Conta"
          text="Você tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita."
        />

        {isLoading ? <SpinnerLoader /> :
          <Box p={4} bg="white" boxShadow="sm" borderRadius="md">

            <Text fontSize="xl" fontWeight="semibold" mb={3} color="gray.700">
              Contas Bancárias
            </Text>

            <Box display="flex" justifyContent="space-between" width="90%">
              <Box
                alignContent="center"
                alignItems="center"
                _hover={{
                  transform: "scale(1.04)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <AddButton text="Adicionar Conta" onClick={openModal} />
              </Box>

              <Box>

                <Button colorScheme="gray" mb={3} onClick={toggleFilters} size="sm">
                  {showFilters ? (
                    <Icon fontSize="15px" as={FaAngleUp} />
                  ) : (
                    <Icon fontSize="15px" as={FaFilter} />
                  )}
                </Button>

              </Box>

            </Box>

            <Collapse in={showFilters}>

              <Flex gap={3} mb={4} width="90%">

                <Input
                  placeholder="Número"
                  value={numberFilter}
                  onChange={(e) => setNumberFilter(e.target.value)}
                  size="sm"
                  style={{ borderRadius: '5px' }}
                  focusBorderColor="#8cff9a"
                />

                <Input
                  placeholder="Nome"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  size="sm"
                  style={{ borderRadius: '5px' }}
                  focusBorderColor="#8cff9a"
                />

              </Flex>

            </Collapse>

            <Table variant="simple" colorScheme="gray">

              <Thead>
                <Tr>
                  <Th >Número</Th>
                  <Th >Banco</Th>
                  <Th width={"15.7%"}>Ações</Th>
                </Tr>
              </Thead>

              <Tbody>
                {paginatedData.map((item: any) => (
                  <Tr key={item.id}>
                    <Td>{item.number}</Td>
                    <Td>{item.fk_bank.name}</Td>
                    <Td>

                      <Button
                        colorScheme="gray"
                        size="sm"
                        _hover={{
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleEdit(item)}
                      >
                        <Icon fontSize="20px" as={MdEditNote} />
                      </Button>

                      <Button
                        background="black"
                        size="sm"
                        ml={2}
                        _hover={{
                          background: "black",
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon color="white" fontSize="13px" as={FaTrashAlt} />
                      </Button>

                    </Td>
                  </Tr>
                ))}
              </Tbody>

            </Table>

            {accounts.length > 7 &&

              <Flex justify="space-between" mt={4} width="90%">

                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 0}
                  leftIcon={<BiChevronLeft />}
                />

                <Button
                  onClick={goToNextPage}
                  isDisabled={currentPage >= totalPages - 1}
                  rightIcon={<BiChevronRight />}
                />

              </Flex>

            }

          </Box>
        }

      </>

    );

  }

  // #region  Banks
  else if (page === 'banks') {

    //estados
    const [bankData, setBankData] = useState<IBanks[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedBank, setSelectedBank] = useState<IBanks | undefined>(undefined);
    const [nameFilter, setNameFilter] = useState('');
    const [codeFilter, setCodeFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [bankToDelete, setBankToDelete] = useState<string | null>(null);
    const rowsPerPage = 7;

    //http
    const getBanks = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/banks/user/${user}`);
        const data = response.data;

        if (data && Array.isArray(data)) {
          setBankData(data);
          setIsLoading(false);
        } else {
          console.warn("Categorias retornaram como null ou formato inválido.");
          setBankData([]);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setBankData([]);
        setIsLoading(false);
      }
    }, [user]);

    const confirmDelete = async () => {
      if (bankToDelete) {
        try {
          await api.delete(`${import.meta.env.VITE_SERVER_ADDRESS}/banks/delete/${bankToDelete}`);
          setBankData((prev) => prev.filter((item) => item.id !== bankToDelete));
          setBankToDelete(null);
          setOpenDeleteModal(false);
          SucessMessage('Banco excluído com sucesso!');
        } catch (error) {
          ErrorMessage('Esse banco possui vínculo com conta(s).');
          setBankToDelete(null);
          setOpenDeleteModal(false);
        }
      }
    };

    //funções utilitárias
    const toggleFilters = () => {
      setShowFilters((prev) => !prev);
    };

    const openModal = () => setOpenAddModal(true);

    const openEditModalCard = () => setOpenEditModal(true);

    const closeAddModal = () => {

      getBanks();
      setOpenAddModal(false);

    }

    const closeEditModal = () => setOpenEditModal(false);

    const openDeleteModalCard = () => setOpenDeleteModal(true);

    const closeDeleteModal = () => setOpenDeleteModal(false);

    const handleEdit = (bank: IBanks) => {
      setSelectedBank(bank);
      openEditModalCard();
    };

    const handleDelete = (rowId: string) => {
      setBankToDelete(rowId);
      openDeleteModalCard();
    };

    //filtros
    const paginatedData = useMemo(() => {
      let filteredData = bankData;

      if (nameFilter) {
        filteredData = filteredData.filter((item) =>
          item.name.toLowerCase().includes(nameFilter.toLowerCase())
        );
      }

      if (codeFilter) {
        filteredData = filteredData.filter((item) =>
          item.code.toLowerCase().includes(codeFilter.toLowerCase())
        );
      }

      const startIndex = currentPage * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;

      return filteredData.slice(startIndex, endIndex);
    }, [currentPage, bankData, nameFilter]);

    const totalPages = Math.ceil(bankData.length / rowsPerPage);

    const goToNextPage = () => {
      if (currentPage < totalPages - 1) setCurrentPage((prev) => prev + 1);
    };

    const goToPreviousPage = () => {
      if (currentPage > 0) setCurrentPage((prev) => prev - 1);
    };

    useEffect(() => {
      if (bankData.length != 0) return;

      getBanks();

    }, [getBanks]);


    return (
      <>

        <AddBankModal
          isOpen={openAddModal}
          onClose={closeAddModal}
        />

        <EditBankModal
          isOpen={openEditModal}
          onClose={closeEditModal}
          selectedBank={selectedBank}
          onSave={getBanks}
        />

        <SureDelete
          isOpen={openDeleteModal}
          onClose={() => {
            setBankToDelete(null);
            closeDeleteModal();
          }}
          onSubmit={confirmDelete}
          title="Excluir Banco"
          text="Você tem certeza que deseja excluir este banco? Esta ação não pode ser desfeita."
        />

        {isLoading ? <SpinnerLoader /> :
          <Box p={4} bg="white" boxShadow="sm" borderRadius="md">

            <Text fontSize="xl" fontWeight="semibold" mb={3} color="gray.700">
              Bancos
            </Text>

            <Box display="flex" justifyContent="space-between" width="90%">

              <Box
                alignContent="center"
                alignItems="center"
                _hover={{
                  transform: "scale(1.04)",
                  transition: "transform 0.2s ease-in-out",
                }}
              >

                <AddButton text="Adicionar Banco" onClick={openModal} />

              </Box>

              <Box>

                <Button colorScheme="gray" mb={3} onClick={toggleFilters} size="sm">
                  {showFilters ? (
                    <Icon fontSize="15px" as={FaAngleUp} />
                  ) : (
                    <Icon fontSize="15px" as={FaFilter} />
                  )}
                </Button>

              </Box>

            </Box>

            <Collapse in={showFilters}>

              <Flex gap={3} mb={4} width="90%">

                <Input
                  placeholder="Nome"
                  value={nameFilter}
                  onChange={(e) => setNameFilter(e.target.value)}
                  style={{ borderRadius: '5px' }}
                  size="sm"
                  focusBorderColor="#8cff9a"
                />

                <Input
                  placeholder="Código"
                  value={codeFilter}
                  onChange={(e) => setCodeFilter(e.target.value)}
                  style={{ borderRadius: '5px' }}
                  size="sm"
                  focusBorderColor="#8cff9a"
                />

              </Flex>

            </Collapse>

            <Table variant="simple" colorScheme="gray">

              <Thead>
                <Tr>
                  <Th >Nome</Th>
                  <Th >Código</Th>
                  <Th width={"15.7%"}>Ações</Th>
                </Tr>
              </Thead>

              <Tbody>

                {paginatedData.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.name}</Td>
                    <Td>{item.code}</Td>
                    <Td>
                      <Button
                        colorScheme="gray"
                        size="sm"
                        _hover={{
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleEdit(item)}
                      >
                        <Icon fontSize="20px" as={MdEditNote} />
                      </Button>
                      <Button
                        background="black"
                        size="sm"
                        ml={2}
                        _hover={{
                          background: "black",
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                        onClick={() => handleDelete(item.id)}
                      >
                        <Icon color="white" fontSize="13px" as={FaTrashAlt} />
                      </Button>
                    </Td>
                  </Tr>
                ))}

              </Tbody>

            </Table>

            {bankData.length > 7 &&

              <Flex justify="space-between" mt={4} width="90%">

                <Button
                  onClick={goToPreviousPage}
                  isDisabled={currentPage === 0}
                  leftIcon={<BiChevronLeft />}
                ></Button>

                <Button
                  onClick={goToNextPage}
                  isDisabled={currentPage >= totalPages - 1}
                  rightIcon={<BiChevronRight />}
                ></Button>

              </Flex>

            }

          </Box>
        }

      </>

    );

  }
};
