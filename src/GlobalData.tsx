import { ProfileProvider } from "./enum/ProfileEnum";

const GlobalData: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <ProfileProvider>
                {children}
            </ProfileProvider>
        </>
    )
};

export default GlobalData;