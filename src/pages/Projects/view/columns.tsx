import { Dropdown, MenuProps, Tag } from 'antd';
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
    status: number;
}

const headerStyle = { backgroundColor: '#303030', color: 'white' };
export const Columns = (
    profiles: any,
    profile: number,
    statuses: any[],
    handleClickView: (record: Project) => void,
    handleClickDelete: (record: Project) => void,
    handleClickEdit: (record: Project) => void
): ColumnsType<Project> => {
    const configureItems = (record: Project) => {
        let data: MenuProps['items'] =
            [{
                key: '1',
                label: 'View',
                onClick: () => handleClickView(record),
            }];

        if ([1, 2].includes(profile)) {
            data.push(
                {
                    key: '2',
                    label: 'Edit',
                    onClick: () => handleClickEdit(record),
                }
            )
        }
        if (profile === 1) {
            data.push(
                {
                    key: '3',
                    label: 'Delete',
                    danger: true,
                    onClick: () => handleClickDelete(record),
                }
            )
        }
        return data;
    }

    return [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            onHeaderCell: () => ({ style: headerStyle }),
            sorter: (a, b) => a.projectId - b.projectId,
            defaultSortOrder: 'descend',
            sortDirections: ['ascend', 'descend'],
            width: 0,
            render: () => null,
            hidden: true
        },
        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
            sorter: (a, b) => a.status - b.status,
            sortDirections: ['ascend', 'descend'],
            filters: statuses.map((s) => ({
                text: s.name,
                value: s.id,
            })),
            onFilter: (value, record) => record.status === value,
            render: (_, record) => {
                const { name = '' } = statuses.find((s) => s.id === record.status) || {};
                const colorMap: Record<string, string> = {
                    Active: 'green',
                    'On Hold': 'orange',
                    Completed: 'red',
                };
                const color = colorMap[name] || 'default';
                return <Tag color={color}>{name}</Tag>;
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'startDt',
            key: 'startDt',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => record.startDt ? dayjs(record.startDt, "YYYY-MM-DD").format('DD/MM/YYYY') : '',
        },
        {
            title: 'End Date',
            dataIndex: 'endDt',
            key: 'endDt',
            width: 150,
            onHeaderCell: () => ({ style: headerStyle }),
            render: (_, record) => record.endDt ? dayjs(record.endDt, "YYYY-MM-DD").format('DD/MM/YYYY') : '',
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
                const items = configureItems(record);
                return (
                    <Dropdown
                        placement="top"
                        menu={{ items }}
                        arrow={{ pointAtCenter: true }}
                        trigger={['click']}
                    >
                        <BarsOutlined style={{ cursor: 'pointer' }} />
                    </Dropdown>
                );
            },
        },
    ];
};
