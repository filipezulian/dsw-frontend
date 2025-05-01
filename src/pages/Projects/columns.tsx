import { Dropdown, MenuProps } from 'antd';
import dayjs from 'dayjs';
import { BarsOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';

interface Project {
    key: string;
    title: string;
    description: string;
    startDt: string;
    endDt: string;
    totalHours: number;
}

const headerStyle = { backgroundColor: '#303030', color: 'white' };

export const Columns = (
    handleClickView: (record: Project) => void,
    handleClickDelete: (record: Project) => void
): ColumnsType<Project> => {
    return [
        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'Start Date',
            dataIndex: 'startDt',
            key: 'startDt',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => record.startDt ? dayjs(record.startDt, "DD-MM-YYYY").format('DD/MM/YYYY') : '',
        },
        {
            title: 'End Date',
            dataIndex: 'endDt',
            key: 'endDt',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => record.endDt ? dayjs(record.endDt, "DD-MM-YYYY").format('DD/MM/YYYY') : '',
        },
        {
            title: 'Total Hours',
            dataIndex: 'totalTime',
            key: 'totalTime',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'Action',
            key: 'action',
            width: 90,
            align: 'center',
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: '1',
                        label: 'View',
                        onClick: () => handleClickView(record),
                    },
                    {
                        key: '2',
                        label: 'Delete',
                        danger: true,
                        onClick: () => handleClickDelete(record),
                    },
                ];

                return (
                    <Dropdown
                        placement="top"
                        menu={{ items }}
                        arrow={{ pointAtCenter: true }}
                    >
                        <BarsOutlined style={{ cursor: 'pointer' }} />
                    </Dropdown>
                );
            },
        },
    ];
};
