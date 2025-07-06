import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FloatButton, Input, Modal } from "antd";
import {
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useProfileEnum } from "../../enum/ProfileEnum";

interface Children {
    children: any
}

const SystemLayout: React.FC<Children> = ({ children }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('Undefined');
    const [parsedUser, setParsedUser] = useState('Undefined');
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);
    const user = Cookies.get("user");
    const { profiles } = useProfileEnum();

    useEffect(() => {
        if (user) {
            const parsedUser = JSON.parse(user);
            setParsedUser(parsedUser);
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
                    onClick={() => setOpenProfile(true)}
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
            <Modal
                title={`${username}'s Profile`}
                open={openProfile}
                okText={"Close"}
                closable={false}
                onOk={() => {setOpenProfile(false)}}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p>Email:</p>
                <Input
                    readOnly={true}
                    value={parsedUser.sub}
                ></Input>
                    <p>Role:</p>
                <Input
                    readOnly={true}
                    value={profiles[parsedUser.profile]}
                ></Input>
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
