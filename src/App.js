import React, { useState } from "react";
import { Layout, Tabs, App as AntdApp } from "antd";
import { TeamOutlined, AppstoreOutlined } from "@ant-design/icons";
import TeacherList from "./components/TeacherList";
import CreateTeacherForm from "./components/CreateTeacherForm";
import PositionList from "./components/PositionList";
import CreatePositionForm from "./components/CreatePositionForm";
import "antd/dist/reset.css";

const { Header, Content } = Layout;

function App() {
  const [activeTab, setActiveTab] = useState("teachers");
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [teacherRefresh, setTeacherRefresh] = useState(0);
  const [positionRefresh, setPositionRefresh] = useState(0);

  const handleTeacherSuccess = () => {
    setTeacherRefresh((prev) => prev + 1);
  };

  const handlePositionSuccess = () => {
    setPositionRefresh((prev) => prev + 1);
  };

  const tabItems = [
    {
      key: "teachers",
      label: (
        <span>
          <TeamOutlined />
          Giáo Viên
        </span>
      ),
      children: (
        <TeacherList
          onCreateClick={() => setShowTeacherForm(true)}
          refreshTrigger={teacherRefresh}
        />
      ),
    },
    {
      key: "positions",
      label: (
        <span>
          <AppstoreOutlined />
          Vị Trí Công Tác
        </span>
      ),
      children: (
        <PositionList
          onCreateClick={() => setShowPositionForm(true)}
          refreshTrigger={positionRefresh}
        />
      ),
    },
  ];

  return (
    <AntdApp>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "0 50px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h1 style={{ color: "white", margin: 0, fontSize: "24px" }}>
            🎓 Hệ Thống Quản Lý Giáo Viên
          </h1>
        </Header>

        <Content style={{ padding: "24px 50px", background: "#f0f2f5" }}>
          <div
            style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </div>
        </Content>

        <CreateTeacherForm
          visible={showTeacherForm}
          onClose={() => setShowTeacherForm(false)}
          onSuccess={handleTeacherSuccess}
        />

        <CreatePositionForm
          visible={showPositionForm}
          onClose={() => setShowPositionForm(false)}
          onSuccess={handlePositionSuccess}
        />
      </Layout>
    </AntdApp>
  );
}

export default App;
