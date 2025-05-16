import { Button, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Columns } from "./columns";
import { useProfileEnum } from "../../../enum/ProfileEnum";
import { useNavigate } from "react-router-dom";

const Projects: React.FC = () => {
    const [projects, setProjects] = useState();
    const [profile, setProfile] = useState(3);
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
            setProjects(response.data.map((p: any) => ({ ...p, key: p.id })));
        } catch (error) {
            console.error("Error: ", error)
            throw new Error();
        }
    };

    useEffect(() => {
        getProfiles();
        getProjects();
    }, [user]);

    const handleClickEdit = (record: any) => {
        navigate(`/projects/edit/${record.projectId}`);
    }
    const handleClickDelete = () => {
        console.log('click')
    }
    const handleClickView = () => {
        console.log('click')
    }

    return (
        <>
            {projects && profile && (
                <Space direction="vertical" size='large'>
                    <h3>Projects</h3>
                    <Table dataSource={projects} columns={Columns(profiles, profile, handleClickView, handleClickDelete, handleClickEdit)}></Table>
                    {profile === 1 && (<Button onClick={() => { navigate('/projects/create') }}>Create new project</Button>)}
                </Space>
            )}
        </>

    );
};

export default Projects;
