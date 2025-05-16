import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FloatButton, Modal } from "antd";
import {
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface Children {
    children: any
}

const SystemLayout: React.FC<Children> = ({ children }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('Undefined');
    const [open, setOpen] = useState(false);
    const user = Cookies.get("user");

    useEffect(() => {
        if (user) {
            const parsedUser = JSON.parse(user)
            setUsername(parsedUser.sub.split("@")[0])
        }
    }, [user])

    const handleOk = () => {
        Cookies.remove("user");
        Cookies.remove("accessToken");
        toast.success("Successfully logged out!")
        navigate("/login")
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <>
            <FloatButton.Group
                trigger="click"
                icon={<UserOutlined />}
            >
                <FloatButton
                    icon={<UserOutlined />}
                    tooltip={<div>{username}</div>}
                />
                <FloatButton
                    onClick={() => setOpen(true)}
                    icon={<LogoutOutlined />}
                    style={{ backgroundColor: "#b33929" }}
                    tooltip={<div>{"Logout"}</div>}
                />
            </FloatButton.Group>
            <Modal
                title="Hey!"
                open={open}
                okText={"Logout"}
                okButtonProps={{ danger: true }}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Are you sure you want to logout?</p>
            </Modal>
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
