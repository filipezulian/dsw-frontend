import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import CustomModal from "../../../components/CustomModal/CustomModal";
import { DatePicker, Flex, Form, Input, Row, Select } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import { toast } from "react-toastify";

const boxStyle: React.CSSProperties = {
    width: '100%',
};

interface SelectType {
    value: number,
    label: string
}
interface StatusType {
    id: number,
    name: string
}

const ProjectsCreate: React.FC = (project) => {
    const token = Cookies.get('accessToken');
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [status, setStatus] = useState<StatusType[]>([]);
    const [formattedStatus, setFormattedStatus] = useState<SelectType[]>([]);
    const [startDt, setStartDt] = useState<Dayjs>();

    useEffect(() => {
        getStatus()
    }, [project]);

    const getStatus = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/statuses/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setStatus(response.data)
        const formatted = response.data.map((status: any) => ({
            value: status.id,
            label: status.name,
        }));
        setFormattedStatus(formatted);
    }

    const handleSubmit = async () => {
        const data = await form.validateFields();
        const formatted = {
            ...data,
            start_dt: dayjs(data.startDt).format('YYYY-MM-DD'),
            end_dt: dayjs(data.endDt).format('YYYY-MM-DD'),
            status: status.find(s => s.id === data.status)
        }
        try {
            console.log(formatted)
            await axios.post(`${import.meta.env.VITE_API_URL}/projects/create`, formatted, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Project created successfuly');
            navigate('/projects');
        } catch (error) {
            console.error('Error: ', error);
            toast.error('Failed to create project');
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
                    label="Description"
                    name="description"
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
                <Row>
                    <Flex align="start" justify="space-between" style={boxStyle}>
                        <Form.Item
                            style={{
                                width: '45%'
                            }}
                            label="Start Date"
                            name="start_dt"
                            rules={[{ required: true, message: "Please input a start date!" }]}
                        >
                            <DatePicker
                                style={{
                                    backgroundColor: "#313131",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "10px",
                                    width: "100%",
                                }}
                                onChange={(value: Dayjs) => { setStartDt(value) }}
                                placeholder="Enter a start date"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{
                                width: '45%'
                            }}
                            label="End Date"
                            name="end_dt"
                            rules={[{ required: true, message: "Please input an end date!" }]}
                        >
                            <DatePicker
                                style={{
                                    backgroundColor: "#313131",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "10px",
                                    width: "100%"
                                }}
                                placeholder="Enter an end date"
                                disabled={!startDt}
                                minDate={startDt}
                            />
                        </Form.Item>
                    </Flex>
                </Row>
                <Row>
                    <Flex align="start" justify="space-between" style={boxStyle}>
                        <Form.Item
                            style={{
                                width: '45%'
                            }}
                            label="Total Hours"
                            name="total_time"
                            rules={[{ required: true, message: "Please input the total hours!" }]}
                        >
                            <Input
                                style={{
                                    backgroundColor: "#313131",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    padding: "10px",
                                }}
                                placeholder="Enter the total hours"
                            />
                        </Form.Item>
                        <Form.Item
                            style={{
                                width: '45%'
                            }}
                            label="Status"
                            name="status"
                            rules={[{ required: true, message: "Please select a status!" }]}
                        >
                            <Select
                                style={{
                                    backgroundColor: "#313131",
                                    color: "#fff",
                                    height: '44px',
                                }}
                                options={formattedStatus}
                            />
                        </Form.Item>
                    </Flex>
                </Row>
                <Row>
                    <Flex gap="middle" align="start" justify="space-between" style={boxStyle}>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                            <button type="button" onClick={() => { navigate('/projects') }}>Voltar</button>
                        </div>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                            <button type="submit" onClick={handleSubmit}>Create</button>
                        </div>
                    </Flex>
                </Row>
            </Form>
        </CustomModal>

    );
};

export default ProjectsCreate;
