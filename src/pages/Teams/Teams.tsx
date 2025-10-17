"use client";
import React, { useState } from "react";
import {
 Table,
 Button,
 Space,
 Popconfirm,
 Tag,
 message,
 Flex,
 Typography,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
 useFetchTeams,
 useCreateTeam,
 useUpdateTeam,
 useDeleteTeam,
} from "@/services/teams/team";
import TeamFormModal from "@/components/modules/teams/TeamFormModal";
import type { TableProps } from "antd";
import { Team } from "@/lib/types/team";
import { TeamFormData } from "@/lib/schemas/team-schema";

const { Title } = Typography;

const TeamsPage: React.FC = () => {
 const [pagination, setPagination] = useState({ page: 1, limit: 10 });
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingTeam, setEditingTeam] = useState<Team | null>(null);
 // 1. Loading state ko ID ke liye banayein
 const [deletingId, setDeletingId] = useState<string | null>(null);

 // API Hooks
 const { data: teamsData, isLoading: isTeamsLoading } = useFetchTeams(
  pagination.page,
  pagination.limit
 );
 const { mutate: createTeam, isPending: isCreating } = useCreateTeam();
 const { mutate: updateTeam, isPending: isUpdating } = useUpdateTeam();
 // isPending yahan se hata dein kyunke hum custom state use kar rahe hain
 const { mutate: deleteTeam } = useDeleteTeam();

 const handleTableChange: TableProps<any>["onChange"] = (newPagination) => {
  setPagination({
   page: newPagination.current || 1,
   limit: newPagination.pageSize || 10,
  });
 };

 // ... Modal Functions waise hi rahenge ...
 const showCreateModal = () => {
  setEditingTeam(null);
  setIsModalOpen(true);
 };

 const showEditModal = (team: Team) => {
  setEditingTeam(team);
  setIsModalOpen(true);
 };

 const handleCancel = () => {
  setIsModalOpen(false);
  setEditingTeam(null);
 };

 const handleFormSubmit = (formData: TeamFormData) => {
  if (editingTeam) {
   // Update Team
   updateTeam(
    { id: editingTeam.id, payload: formData },
    {
     onSuccess: () => {
      message.success("Team updated successfully!");
      handleCancel();
     },
     onError: (error: any) =>
      message.error(
       error.response?.data?.error || "Failed to update team"
      ),
    }
   );
  } else {
   // Create Team
   createTeam(formData, {
    onSuccess: () => {
     message.success("Team created successfully!");
     handleCancel();
    },
    onError: (error: any) =>
     message.error(error.response?.data?.error || "Failed to create team"),
   });
  }
 };

 // 2. handleDelete function ko update karein
 const handleDelete = (id: string) => {
  // Delete karne se pehle ID set karein
  setDeletingId(id);
  deleteTeam(id, {
   onSuccess: () => {
    message.success("Team deleted successfully!");
   },
   onError: (error: any) => {
    message.error(error.response?.data?.error || "Failed to delete team");
   },
   onSettled: () => {
    // Success ya error, dono ke baad ID reset karein
    setDeletingId(null);
   },
  });
 };

 // 3. Table columns ko update karein
 const columns: TableProps<Team>["columns"] = [
  {
   title: "Team Name",
   dataIndex: "name",
   key: "name",
   sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
   title: "Pokémon",
   dataIndex: "pokemons",
   key: "pokemons",
   render: (pokemons: string[]) => (
    <Flex gap="4px 0" wrap="wrap">
     {pokemons.map((p) => (
      <Tag key={p}>{p}</Tag>
     ))}
    </Flex>
   ),
  },
  {
   title: "Actions",
   key: "actions",
   render: (_, record) => {
    // Check karein ke kya yeh row delete ho rahi hai
    const isCurrentRowDeleting = deletingId === record.id;

    return (
     <Space
      size="middle"
      className="flex flex-col md:flex-row items-center"
     >
      <Button
       type="link"
       icon={<EditOutlined />}
       onClick={() => showEditModal(record)}
      >
       Edit
      </Button>
      <Popconfirm
       title="Delete the team"
       description="Are you sure you want to delete this team?"
       onConfirm={() => handleDelete(record.id)}
       okText="Yes"
       cancelText="No"
       // Jab tak ek item delete ho raha hai, doosre ko disable rakhein
       disabled={!!deletingId}
      	okButtonProps={{
        className: "my-custom-ok-button",
        style: { color: 'black' }
      }}
      >
       <Button
        type="link"
        icon={<DeleteOutlined />}
        danger
        // Loading state ko yahan control karein
        loading={isCurrentRowDeleting}
       >
        Delete
       </Button>
      </Popconfirm>
     </Space>
    );
   },
  },
 ];

 return (
  <div className="p-5">
   {/* ... Baaki JSX waise hi rahega ... */}
   <Flex justify="space-between" align="center" style={{ marginBottom: 24 }}>
    <Title level={2}>Manage Your Teams</Title>
    <Button
     icon={<PlusOutlined />}
     onClick={showCreateModal}
     className="hover:!text-green-600 "
    >
     Create Team
    </Button>
   </Flex>
   <Table
    columns={columns}
    dataSource={teamsData?.teams}
    rowKey="id"
    className="overflow-auto"
    loading={isTeamsLoading}
    pagination={{
     current: teamsData?.pagination.page,
     pageSize: teamsData?.pagination.limit,
     total: teamsData?.pagination.total,
    }}
    onChange={handleTableChange}
    bordered
   />
  {isTeamsLoading ? <><Spin /></> : <><TeamFormModal
    open={isModalOpen}
    onClose={handleCancel}
    onSubmit={handleFormSubmit}
    initialData={editingTeam}
    isLoading={isCreating || isUpdating || isTeamsLoading}
   /></>}



   
  </div>
 );
};

export default TeamsPage;