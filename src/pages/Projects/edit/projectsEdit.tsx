import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import CustomModal from "../../../components/CustomModal/CustomModal";
import { DatePicker, Flex, Form, Input, Row, Select, Skeleton } from "antd";
import { useNavigate, useParams } from "react-router-dom";
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

const ProjectsEdit: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const token = Cookies.get('accessToken');
    const [formattedStatus, setFormattedStatus] = useState<SelectType[]>([]);
    const [startDt, setStartDt] = useState<Dayjs>();
    const [project, setProject] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getStatus();
        getProject();
        setLoading(false)
    }, [id]);

    const getProject = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/id/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = response.data;
        setProject(data);
        form.setFieldsValue({
            id: data.id,
            name: data.name,
            description: data.description,
            start_dt: data.start_dt ? dayjs(data.start_dt) : null,
            end_dt: data.end_dt ? dayjs(data.end_dt) : null,
            total_time: data.total_time,
            status: data.status?.id,
        });
    }

    const getStatus = async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/statuses/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const formatted = response.data.map((status: any) => ({
            value: status.id,
            label: status.name,
        }));
        setFormattedStatus(formatted);
    }

    const handleSubmit = async () => {
        const data = await form.validateFields();
        data.start_dt = dayjs(data.start_dt).format('YYYY-MM-DD');
        data.end_dt = dayjs(data.end_dt).format('YYYY-MM-DD');
        data.status = {id: data.status}
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/projects/edit`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Project successfully edited');
            navigate(`/projects`);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message || 'Failed to save project')
        }
    }


    return (
        <CustomModal
            backgroundColor="#262626"
            height="450px"
            width="850px"
        >
            <Skeleton active loading={loading} />
            {project &&
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                >
                    <Form.Item hidden name="id">
                        <Input hidden readOnly></Input>
                    </Form.Item>
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
                                    format="DD-MM-YYYY"
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
                                    format="DD-MM-YYYY"
                                    placeholder="Enter an end date"
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
                                <button type="button" onClick={() => { navigate('/projects') }}>Back</button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                                <button type="submit" onClick={handleSubmit}>Save</button>
                            </div>
                        </Flex>
                    </Row>
                </Form>
            }
        </CustomModal>

    );
};

export default ProjectsEdit;
