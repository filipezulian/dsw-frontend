import React from "react";
import CustomModal from "../../components/CustomModal/CustomModal";
import { Form, Input } from "antd";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
    const [form] = Form.useForm();
    const { authenticate } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const data = await form.validateFields();
            const results = await authenticate(data.email, data.password);
            if (results && results.token) {
                toast.success("Login successful!");
                navigate("/projects");
            }
        } catch (errorInfo) {
            console.error("Validation Failed:", errorInfo);
        }
    };

    return (
        <CustomModal
            backgroundColor="#262626"
            height="235px"
        >
            <Form
                form={form}
                layout="vertical"
                style={{ width: "100%" }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please input your email!" }]}
                >
                    <Input
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter your email"
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input your password!" }]}
                >
                    <Input.Password
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter your password"
                    />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                    <button onClick={handleSubmit}>Login</button>
                </div>
            </Form>
        </CustomModal>
    );
};

export default Auth;
