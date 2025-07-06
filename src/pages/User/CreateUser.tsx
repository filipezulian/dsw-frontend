import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Flex, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CustomModal from "../../components/CustomModal/CustomModal";
import { useProfileEnum } from "../../enum/ProfileEnum";

const boxStyle: React.CSSProperties = {
    width: '100%',
};

const CreateUser: React.FC = () => {
    const token = Cookies.get('accessToken');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { profiles } = useProfileEnum();


    const handleSubmit = async () => {
        const data = await form.validateFields();
        try {
            if (data.password != data.confirmPassword) {
                throw Error("Passwords don't match")
            }
            const formatted = {
                name: data.name,
                email: data.email,
                password: data.password,
                profile: { id: data.profile }
            }
            await axios.post(`${import.meta.env.VITE_API_URL}/user/create`, formatted, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('User created successfuly');
            navigate('/projects');
        } catch (error: any) {
            console.log('Error: ', error);
            toast.error(error.message || 'Failed to create User');
        }
    }


    return (
        <CustomModal
            backgroundColor="#262626"
            height="450px"
            width="850px"
        >
            <Form
                form={form}
                layout="vertical"
                style={{ width: "100%" }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please input a name!" }]}
                >
                    <Input
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter a name"
                    />
                </Form.Item>

                <Form.Item
                    label="Role"
                    name="profile"
                    rules={[{ required: true, message: "Please select a profile!" }]}
                >
                    <Select placeholder="Select a profile">
                        {Object.entries(profiles).map(([id, label]) => (
                            <Select.Option key={id} value={id}>
                                {label}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Please input a description!" }]}
                >
                    <Input
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter a description"
                    />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please input a password!" }]}
                >
                    <Input
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter a password"
                        type="password"
                    />
                </Form.Item>

                <Form.Item
                    label="Confirm password"
                    name="confirmPassword"
                    rules={[{ required: true, message: "Please input a password!" }]}
                >
                    <Input
                        style={{
                            backgroundColor: "#313131",
                            color: "#fff",
                            borderRadius: "6px",
                            padding: "10px",
                        }}
                        placeholder="Enter a password"
                        type="password"
                    />
                </Form.Item>
                <Row>
                    <Flex gap="middle" align="start" justify="space-between" style={boxStyle}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                            <button type="button" onClick={() => { navigate('/projects') }}>Back</button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                            <button type="submit" onClick={handleSubmit}>Create</button>
                        </div>
                    </Flex>
                </Row>
            </Form>
        </CustomModal>

    );
}

export default CreateUser