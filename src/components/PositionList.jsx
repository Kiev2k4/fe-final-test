import React, { useState, useEffect } from "react";
import { Table, Button, Tag, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { teacherPositionAPI } from "../services/api";

const PositionList = ({ onCreateClick, refreshTrigger }) => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, [refreshTrigger]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await teacherPositionAPI.getPositions();

      if (response.data.success) {
        setPositions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      message.error("Không thể tải danh sách vị trí công tác");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 120,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "warning"}>
          {isActive ? "Hoạt động" : "Ngưng"}
        </Tag>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "des",
      key: "des",
      render: (des) => des || "Không có mô tả",
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
        <h2>Danh Sách Vị Trí Công Tác</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          Tạo Vị Trí Công Tác
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={positions}
        loading={loading}
        rowKey="_id"
        bordered
        pagination={false}
      />
    </div>
  );
};

export default PositionList;
