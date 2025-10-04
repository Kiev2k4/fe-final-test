import React, { useState } from "react";
import { Modal, Form, Input, Radio, Button, Space, message } from "antd";
import { teacherPositionAPI } from "../services/api";

const { TextArea } = Input;

const CreatePositionForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await teacherPositionAPI.createPosition(values);

      if (response.data.success) {
        message.success("Tạo vị trí công tác thành công!");
        form.resetFields();
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating position:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo vị trí công tác"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Vị Trí Công Tác"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true,
        }}
      >
        <Form.Item
          label="Mã"
          name="code"
          rules={[
            { required: true, message: "Vui lòng nhập mã!" },
            {
              pattern: /^[A-Z0-9]+$/,
              message: "Mã chỉ chứa chữ in hoa và số!",
            },
          ]}
          extra="Mã định danh vị trí (viết tắt, in hoa)"
        >
          <Input placeholder="VD: GVBM, TBM, HP..." />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
        >
          <Input placeholder="VD: Giáo viên bộ môn" />
        </Form.Item>

        <Form.Item label="Mô tả" name="des">
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết về vị trí công tác này..."
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="isActive">
          <Radio.Group>
            <Radio value={true}>Hoạt động</Radio>
            <Radio value={false}>Ngưng</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
          <Space>
            <Button onClick={handleCancel}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Lưu
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePositionForm;
