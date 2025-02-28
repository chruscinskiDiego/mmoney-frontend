import { Navigate, Outlet } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import Sidebar from "../../components/Sidebar";
import { Flex, Box } from "@chakra-ui/react";
import { AuthService } from "../../services/AuthService";
import { AppLoader } from "../../loaders/AppLoader";

const ProtectedRoute = () => {
    const { isLoggedIn, setIsLoggedIn, user } = useContext(AppContext);

    // Verifica se o usuário está autenticado
    const tokenValid = AuthService.isAuthenticated();

    if (!tokenValid) {
        // Atualiza o estado global
        if (isLoggedIn) {
            setIsLoggedIn(false);
        }
        return <Navigate to="/login" />;
    }

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    return (
        <>
        {user ?
        <Flex height="100vh">
            <Sidebar isExpanded={isSidebarExpanded} toggleExpand={toggleSidebar} />
            <Box
                flex="1"
                transition="margin-left 0.2s"
                p="4"
                overflowY="auto"
                bg="gray.50"
            >
                <Outlet />
            </Box>
        </Flex>
        :
        <AppLoader/>
        }
        </>
    );
};

export default ProtectedRoute;
