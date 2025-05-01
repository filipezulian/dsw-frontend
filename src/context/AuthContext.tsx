import React, { createContext, useContext, useEffect, ReactNode } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface DecodedToken {
    exp: number;
}

interface AuthContextType {
    authenticate: (email: string, password: string) => Promise<any | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const token = Cookies.get("accessToken");
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = () => {
            if (!!token) {
                try {
                    const decoded = jwtDecode<DecodedToken>(token);
                    const currentTime = Date.now() / 1000;
                    if (decoded.exp < currentTime) {
                        toast.error("Session expired!");
                        Cookies.remove("accessToken");
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Invalid token");
                    Cookies.remove("accessToken");
                }
            }
        };
        checkAuth();
    }, [token, navigate]);

    const authenticate = async (email: string, password: string): Promise<any | null> => {
        const credencial = { email: email, password: password };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/auth`, credencial);
            if (response.data.token) {
                Cookies.set("accessToken", response.data.token, {
                    expires: 1,
                    secure: false,
                    sameSite: "strict",
                });
                const decoded = jwtDecode<DecodedToken>(response.data.token);
                Cookies.set("user", JSON.stringify(decoded), {
                    expires: 1,
                    secure: false,
                    sameSite: "strict",
                });
            }
            return response.data;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to authenticate");
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ authenticate }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
