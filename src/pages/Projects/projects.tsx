import { Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Columns } from "./columns";

const Projects: React.FC = () => {
    const [projects, setProjects] = useState();
    const token = Cookies.get('accessToken');

    const getProjects = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/projects/all`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProjects(response.data)
        } catch (error) {
            console.error("Error: ", error)
            throw new Error();
        }
    }

    useEffect(() => {
        getProjects();
    }, []);

    const handleClickEdit = () => {
        console.log('click')
    }
    const handleClickDelete = () => {
        console.log('click')
    }

    return (
        <>
            {projects && (<>
                <h3>Projects</h3>
                <Table dataSource={projects} columns={Columns(handleClickEdit, handleClickDelete)}></Table>
            </>)}
        </>

    );
};

export default Projects;
