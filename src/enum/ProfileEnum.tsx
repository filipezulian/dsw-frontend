import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

type ProfileEnum = { [key: string]: string };

interface ProfileContextProps {
    profiles: ProfileEnum;
    loading: boolean;
}

const ProfileContext = createContext<ProfileContextProps>({
    profiles: {},
    loading: true,
});

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profiles, setProfiles] = useState<ProfileEnum>({});
    const [loading, setLoading] = useState(true);
    const token = Cookies.get('accessToken');

    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/profiles/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfiles(response.data);
        } catch (error) {
            console.error("Failed to load profiles enum:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <ProfileContext.Provider value={{ profiles, loading }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfileEnum = () => useContext(ProfileContext);