import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Button, DatePicker, Flex, Form, Input, Progress, Row, Select, Space, Tag, } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { Dayjs } from 'dayjs';
import dayjs from "dayjs";
import CustomModal from "../../../components/CustomModal/CustomModal";

const boxStyle: React.CSSProperties = {
    width: '100%',
};
interface SelectType {
    value: number,
    label: string
}

interface Project {
    id: number;
    name: string;
    description: string;
    start_dt: Dayjs | null;
    end_dt: Dayjs | null;
    total_time: number;
    status: SelectType | null;
}

const ViewProject: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const token = Cookies.get('accessToken');
    const [formattedStatus, setFormattedStatus] = useState<SelectType[]>([]);
    const [project, setProject] = useState<Project>();
    const [color, setColor] = useState<string | undefined>();
    const [statusName, setStatusName] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            await getStatus();
            await getProject();
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        if (project && formattedStatus.length > 0) {
            renderTagColor();
        }
    }, [project, formattedStatus]);

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

    const calculateProgress = () => {
        if (project && project.start_dt && project.end_dt) {
            const startDate = dayjs(project.start_dt);
            const endDate = dayjs(project.end_dt);
            const today = dayjs();
            
            if (today.isBefore(startDate)) {
                return 0;
            }
            
            if (today.isAfter(endDate)) {
                return 100;
            }
            
            const totalDuration = endDate.diff(startDate, 'day');
            const elapsed = today.diff(startDate, 'day');
            
            if (totalDuration === 0) {
                return 100;
            }
            
            const totalProgress = Math.round((elapsed / totalDuration) * 100);
            return Math.max(0, Math.min(100, totalProgress));
        }
        return 0;
    }

    const renderTagColor = async () => {
        if (project && formattedStatus.length > 0) {
            let statusId;
            if (project.status && typeof project.status === 'object') {
                statusId = project.status.value || project.status.id;
            } else {
                statusId = project.status;
            }
            const statusObj = formattedStatus.find((s) => s.value === statusId);
            const name = statusObj?.label || '';
            const colorMap: Record<string, string> = {
                'Active': 'green',
                'On Hold': 'orange',
                'Completed': 'red',
            };
            const tagColor = colorMap[name] || 'default';
            setColor(tagColor);
            setStatusName(name);
        }
    }

    return (
        project && (<CustomModal
            backgroundColor="#262626"
            height="53%"
            width="80%"
            fontColor="#fff"
        >
            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                <Flex style={boxStyle} gap="small" vertical>
                    <Progress percent={calculateProgress()} status="active" size={[800, 20]} />
                </Flex>
                <h2>{project?.name}</h2>
                <Form
                    form={form}
                    layout="vertical"
                    style={{ width: "100%" }}
                >
                    <Form.Item
                        label="Description"
                        name="description"
                    >
                        <Input
                            style={{
                                backgroundColor: "#313131",
                                color: "#fff",
                                borderRadius: "6px",
                                padding: "10px",
                            }}
                            readOnly
                            disabled
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
                            >
                                <DatePicker
                                    style={{
                                        backgroundColor: "#313131",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        padding: "10px",
                                        width: "100%",
                                    }}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                style={{
                                    width: '45%'
                                }}
                                label="End Date"
                                name="end_dt"
                            >
                                <DatePicker
                                    style={{
                                        backgroundColor: "#313131",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        padding: "10px",
                                        width: "100%"
                                    }}
                                    format={'DD/MM/YYYY'}
                                    readOnly
                                    disabled
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
                            >
                                <Input
                                    style={{
                                        backgroundColor: "#313131",
                                        color: "#fff",
                                        borderRadius: "6px",
                                        padding: "10px",
                                    }}
                                    readOnly
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item
                                style={{
                                    width: '45%'
                                }}
                                label="Status"
                                name="status"
                            >
                                <Tag
                                    style={{
                                        width: '100%',
                                        height: '45px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '25px'
                                    }}
                                    color={color}>{statusName}</Tag>
                            </Form.Item>
                        </Flex>
                    </Row>
                    <Row>
                        <Flex gap="middle" align="start" justify="space-between" style={boxStyle}>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                                <button type="button" onClick={() => { navigate('/projects') }}>Back</button>
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", gap: "10px" }}>
                            </div>
                        </Flex>
                    </Row>
                </Form>
            </Space>
        </CustomModal>)
    );
}

export default ViewProject