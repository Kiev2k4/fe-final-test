import React, { useState, useEffect } from "react";
import { Table, Button, Tag, Avatar, Space, message } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { teacherAPI } from "../services/api";

const TeacherList = ({ onCreateClick, refreshTrigger }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    fetchTeachers(pagination.current, pagination.pageSize);
  }, [refreshTrigger]);

  const fetchTeachers = async (page, pageSize) => {
    try {
      setLoading(true);
      const response = await teacherAPI.getTeachers(page, pageSize);

      if (response.data.success) {
        setTeachers(response.data.data);
        setPagination({
          current: response.data.pagination.page,
          pageSize: response.data.pagination.limit,
          total: response.data.pagination.total,
        });
      }
    } catch (error) {
      console.error("Error fetching teachers:", error);
      message.error("Không thể tải danh sách giáo viên");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    fetchTeachers(pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: "Mã GV",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Giáo viên",
      key: "teacher",
      width: 250,
      render: (_, record) => (
        <Space>
          {record.avatar ? (
            <Avatar src={record.avatar} size={40} />
          ) : (
            <Avatar
              style={{ backgroundColor: "#87d068" }}
              icon={<UserOutlined />}
              size={40}
            >
              {record.name?.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <div>
            <div style={{ fontWeight: 500 }}>{record.name}</div>
            <div style={{ fontSize: 12, color: "#999" }}>{record.email}</div>
            <div style={{ fontSize: 12, color: "#999" }}>
              {record.phoneNumber}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Trình độ (Loại mẫu)",
      key: "degrees",
      width: 200,
      render: (_, record) =>
        record.degrees?.length > 0 ? (
          <div>
            <div>{record.degrees[0].type}</div>
            <div style={{ fontSize: 12, color: "#999" }}>
              Chuyên ngành: {record.degrees[0].major}
            </div>
          </div>
        ) : (
          "Chưa có"
        ),
    },
    {
      title: "Bộ môn",
      key: "positions",
      width: 200,
      render: (_, record) =>
        record.positions?.length > 0
          ? record.positions.map((pos, idx) => (
              <Tag color="blue" key={idx}>
                {pos.name}
              </Tag>
            ))
          : "Chưa có",
    },
    {
      title: "TT Công tác",
      key: "positionCodes",
      width: 150,
      render: (_, record) =>
        record.positions?.length > 0
          ? record.positions.map((pos, idx) => <div key={idx}>{pos.code}</div>)
          : "Chưa có",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 150,
      render: (address) => address || "Chưa cập nhật",
    },
    {
      title: "Trạng thái",
      key: "isActive",
      width: 120,
      render: (_, record) => (
        <Tag color={record.isActive ? "success" : "warning"}>
          {record.isActive ? "Đang công tác" : "Ngưng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      render: () => <Button type="link">Chi tiết</Button>,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Danh Sách Giáo Viên</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Thêm Giáo Viên
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teachers}
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="_id"
        bordered
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default TeacherList;
