import React, { ReactNode } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Error404 from "./pages/404/404";
import Projects from "./pages/Projects/projects";
import Auth from "./pages/Auth/auth";
import SystemLayout from "./components/Header/Header";

interface AuthenticatedRoutesProps {
    children: ReactNode;
}

const HomeRedirect: React.FC = () => {
    const token = Cookies.get("accessToken");
    const user = Cookies.get("user");

    return token && user ? <Navigate to="/projects" /> : <Navigate to="/login" />;
};

const AuthenticatedRoutes: React.FC<AuthenticatedRoutesProps> = ({ children }) => {
    const user = Cookies.get("user");
    const token = Cookies.get("accessToken");
    return user && token ? <>{children}</> : <Navigate to="/login" />;
};

const MyRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<Auth />} path="/login" />

            {/* Home Redirect */}
            <Route element={<HomeRedirect />} path="/" />

            {/* <Route path="/" element={ } /> */}

            {/* Authenticated Routes */}
            <Route element={
                <AuthenticatedRoutes>
                    <SystemLayout>
                        <Projects />
                    </SystemLayout>
                </AuthenticatedRoutes>
            } path="/projects" />

            {/* Catch-all route */}
            <Route path="*" element={<Error404 />} />
        </Routes>
    );
};

export default MyRoutes;
