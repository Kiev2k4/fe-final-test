import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Teacher APIs
export const teacherAPI = {
  // Lấy danh sách giáo viên với phân trang
  getTeachers: (page = 1, limit = 10) => {
    return api.get(`/teachers?page=${page}&limit=${limit}`);
  },

  // Tạo giáo viên mới
  createTeacher: (teacherData) => {
    return api.post("/teachers", teacherData);
  },
};

// Teacher Position APIs
export const teacherPositionAPI = {
  // Lấy tất cả vị trí công tác
  getPositions: () => {
    return api.get("/teacher-positions");
  },

  // Tạo vị trí công tác mới
  createPosition: (positionData) => {
    return api.post("/teacher-positions", positionData);
  },
};

export default api;
