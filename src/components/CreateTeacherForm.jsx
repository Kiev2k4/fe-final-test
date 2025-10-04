import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Checkbox,
  Space,
  message,
  Divider,
  Upload,
} from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { teacherAPI, teacherPositionAPI } from "../services/api";
import moment from "moment";

const { Option } = Select;
const { TextArea } = Input;

const CreateTeacherForm = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [avatarBase64, setAvatarBase64] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (visible) {
      fetchPositions();
    }
  }, [visible]);

  const fetchPositions = async () => {
    try {
      const response = await teacherPositionAPI.getPositions();
      if (response.data.success) {
        setPositions(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      message.error("Không thể tải danh sách vị trí công tác");
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj || info.file;

    if (file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ được upload file ảnh!");
        return;
      }

      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Ảnh phải nhỏ hơn 2MB!");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result;
        setAvatarBase64(base64);
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Format dates
      const formattedData = {
        ...values,
        dob: values.dob ? values.dob.toISOString() : undefined,
        startDate: values.startDate.toISOString(),
        avatar: avatarBase64,
      };

      const response = await teacherAPI.createTeacher(formattedData);

      if (response.data.success) {
        message.success("Tạo giáo viên thành công!");
        form.resetFields();
        setAvatarBase64(null);
        setImagePreview(null);
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating teacher:", error);
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi tạo giáo viên"
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
      title="Tạo Thông Tin Giáo Viên"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          degrees: [],
        }}
      >
        <Divider orientation="left">Thông tin cá nhân</Divider>

        {/* <- Thêm phần upload ảnh */}
        <Form.Item label="Ảnh đại diện">
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={() => false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          {imagePreview && (
            <div style={{ marginTop: 10 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #d9d9d9",
                }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Space style={{ width: "100%" }} size="large">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
            style={{ flex: 1, minWidth: "45%" }}
          >
            <Input placeholder="example@school.edu.vn" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phoneNumber"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
            style={{ flex: 1, minWidth: "45%" }}
          >
            <Input placeholder="0123456789" />
          </Form.Item>
        </Space>

        <Space style={{ width: "100%" }} size="large">
          <Form.Item
            label="Số CMND/CCCD"
            name="identity"
            style={{ flex: 1, minWidth: "45%" }}
          >
            <Input placeholder="001234567890" />
          </Form.Item>

          <Form.Item
            label="Ngày sinh"
            name="dob"
            style={{ flex: 1, minWidth: "45%" }}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>
        </Space>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Hà Nội" />
        </Form.Item>

        <Divider orientation="left">Thông tin công tác</Divider>

        <Form.Item
          label="Ngày bắt đầu công tác"
          name="startDate"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
        >
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item label="Vị trí công tác" name="teacherPositionsId">
          <Checkbox.Group style={{ width: "100%" }}>
            <Space direction="vertical">
              {positions.map((position) => (
                <Checkbox key={position._id} value={position._id}>
                  {position.name} ({position.code})
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Form.Item>

        <Divider orientation="left">Học vấn</Divider>

        <Form.List name="degrees">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, "type"]}
                    rules={[{ required: true, message: "Chọn bậc học" }]}
                  >
                    <Select placeholder="Bậc" style={{ width: 120 }}>
                      <Option value="Bachelor">Cử nhân</Option>
                      <Option value="Master">Thạc sĩ</Option>
                      <Option value="Doctorate">Tiến sĩ</Option>
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "school"]}
                    rules={[{ required: true, message: "Nhập trường" }]}
                  >
                    <Input placeholder="Trường" style={{ width: 200 }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "major"]}
                    rules={[{ required: true, message: "Nhập chuyên ngành" }]}
                  >
                    <Input placeholder="Chuyên ngành" style={{ width: 150 }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "year"]}
                    rules={[{ required: true, message: "Nhập năm" }]}
                  >
                    <Input
                      type="number"
                      placeholder="Năm"
                      style={{ width: 100 }}
                    />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "isGraduated"]}
                    valuePropName="checked"
                    initialValue={true}
                  >
                    <Checkbox>Đã tốt nghiệp</Checkbox>
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm học vấn
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 24 }}>
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

export default CreateTeacherForm;
