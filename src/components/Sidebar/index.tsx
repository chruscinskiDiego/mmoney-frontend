// src/components/Sidebar.jsx
import { useContext } from "react";
import { Box, Flex, Icon, Text, VStack, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { LiaCashRegisterSolid } from "react-icons/lia";
import { BiCategoryAlt } from "react-icons/bi";
import { BsPiggyBank } from "react-icons/bs";
import { GiBank } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa6";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { FaSignOutAlt } from "react-icons/fa";
import { AuthService } from "../../services/AuthService";
import { AppContext } from "../../contexts/AppContext";
import { GoGoal } from "react-icons/go";

const Sidebar = ({ isExpanded, toggleExpand }:any) => {
    const navigate = useNavigate();
    const { setIsLoggedIn } = useContext(AppContext);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
        setIsLoggedIn(false);
    };

    const menuItems = [
        { label: "Home", icon: FiHome, path: "/home" },
        { label: "Despesas", icon: LiaCashRegisterSolid, path: "/expenses" },
        { label: "Categorias", icon: BiCategoryAlt, path: "/categories" },
        { label: "Contas", icon: BsPiggyBank, path: "/accounts" },
        { label: "Bancos", icon: GiBank, path: "/banks" },
        {label: "Metas", icon: GoGoal, path: "/goals" },
        { label: "Usuário", icon: FaUserTie, path: "/user" },
    ];

    const renderMenuItems = (items:any) =>
        items.map((menu:any, index:any) => (
            <Flex
                key={index}
                align="center"
                p="2"
                cursor="pointer"
                _hover={{
                    bg: "#dcffe0",
                    borderRadius: "5px",
                    width: "100%",
                    paddingLeft: isExpanded ? "1rem" : "0.5rem",
                }}
                onClick={() => navigate(menu.path)}
                tabIndex={-1}
                userSelect="none"
            >
                <Box w="24px" textAlign="center" transition="all 0.2s ease">
                    <Icon as={menu.icon} />
                </Box>
                {isExpanded && <Text ml="3">{menu.label}</Text>}
            </Flex>
        ));

    return (
        <Box
            as="aside"
            width={isExpanded ? "200px" : "60px"}
            bg="#8cff9a"
            color="black"
            p="4"
            transition="width 0.2s"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
        >
            <Box>
                <Button
                    onClick={toggleExpand}
                    mb="4"
                    alignContent={"center"}
                    textAlign={"center"}
                    alignItems={"center"}
                    bg={"#8cff9a"}
                    size="sm"
                >
                    <Icon as={isExpanded ? AiFillCaretLeft : AiFillCaretRight} />
                </Button>
                <VStack align="start" spacing="2">
                    {renderMenuItems([menuItems[0]])}
                    {renderMenuItems(menuItems.slice(1, -1))}
                </VStack>
            </Box>

            <Box>
                {renderMenuItems([menuItems[menuItems.length - 1]])}
                <Flex
                    align="center"
                    p="2"
                    cursor="pointer"
                    _hover={{ bg: "#dcffe0", borderRadius: "5px", width: "100%" }}
                    onClick={handleLogout}
                    tabIndex={-1}
                    userSelect="none"
                >
                    <Box w="24px" textAlign="center">
                        <Icon as={FaSignOutAlt} />
                    </Box>
                    {isExpanded && <Text ml="3">Sair</Text>}
                </Flex>
            </Box>
        </Box>
    );
};

export default Sidebar;
