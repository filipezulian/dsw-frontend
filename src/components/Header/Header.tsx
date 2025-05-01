import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import styles from "./header.module.css";
import Cookies from "js-cookie";

interface Children {
    children: any
}

const SystemLayout: React.FC<Children> = ({ children }) => {
    const [username, setUsername] = useState('Undefined')
    const user = Cookies.get("user");

    useEffect(() => {
        if (user) {
            const parsedUser = JSON.parse(user)
            setUsername(parsedUser.email.split("@")[0])
        }
    }, [user])

    return (
        <>
            <div className={styles.header}>
                {username}
            </div>
            <Content
                style={{
                    margin: '24px 16px',
                    borderRadius: 6,
                }}
            >
                {children}
            </Content>
        </>
    );
};

export default SystemLayout;
