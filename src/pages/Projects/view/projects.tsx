import { Button, Flex, Modal, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Columns } from "./columns";
import { useProfileEnum } from "../../../enum/ProfileEnum";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Projects: React.FC = () => {
    const [projects, setProjects] = useState();
    const [statuses, setStatuses] = useState<any[]>([]);
    const [profile, setProfile] = useState(3);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<any | null>(null);
    const { profiles } = useProfileEnum();
    const navigate = useNavigate();
    const token = Cookies.get('accessToken');
    const user = Cookies.get("user");

    const getProfiles = () => {
        if (user) {
            const parsedUser = JSON.parse(user)
            setProfile(parsedUser.profile);
        }
    };

    const getProjects = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProjects(response.data.map((p: any) => ({ ...p, key: p.projectId, })));
        } catch (error) {
            console.error("Error: ", error)
            throw new Error();
        }
    };

    const getStatus = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/statuses/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setStatuses(response.data);
        } catch (error) {
            console.error("Error: ", error)
            throw new Error();
        }
    };

    useEffect(() => {
        getProfiles();
        getProjects();
        getStatus();
    }, [user]);

    const handleClickEdit = (record: any) => {
        navigate(`/projects/edit/${record.projectId}`);
    }
    const handleClickDelete = (id: any) => {
        setSelectedProjectId(id.projectId);
        setConfirmDelete(true);
    }

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/projects/delete/${selectedProjectId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setConfirmDelete(false);
            toast.success('Projeto deletado com sucesso')
            getProjects();
        } catch (error: any) {
            console.log(error)
            toast.error(error.response.data.message)

        }
    }

    const handleClickView = (record: any) => {
        navigate(`/projects/view/${record.projectId}`);
    }

    return (
        <>
            {projects && profile && (
                <Space direction="vertical" size='large'>
                    <Modal
                        title='Are you sure you want to delete this task?'
                        okText='Yes'
                        okType='danger'
                        open={confirmDelete}
                        onOk={() => { handleDelete() }}
                        onCancel={() => { setConfirmDelete(false); }}
                    >
                        Deleting this project is irreversible and will delete all child information.
                    </Modal>
                    <h3>Projects</h3>
                    <Table rowKey="projectId" dataSource={projects} columns={Columns(profiles, profile, statuses, handleClickView, handleClickDelete, handleClickEdit)}></Table>
                    {profile === 1 && (
                        <Flex gap={10} justify="center" align="center">
                        <Button onClick={() => { navigate('/projects/create') }}>Create new project</Button>
                        </Flex>
                    )}
                </Space>
            )}
        </>

    );
};

export default Projects;
