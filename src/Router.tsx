import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ExpensesPage } from "./pages/ExpensesPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { AccountsPage } from "./pages/AccountsPage";
import { BanksPage } from "./pages/BanksPage";
import { UserPage } from "./pages/UserPage";
import { GoalsPage } from "./pages/GoalsPage";
import { AppLoader } from "./loaders/AppLoader";

export const Router = () => {
    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/loader" element={<AppLoader />} />

            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute />}>
                
                <Route path="/home" element={<HomePage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/accounts" element={<AccountsPage />} />
                <Route path="/banks" element={<BanksPage />} />
                <Route path="/user" element={<UserPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/" element={<Navigate to="/home" />} />
            </Route>

            <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
    );
};
