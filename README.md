
# 🏠 Smart Home Monitoring & Alert System  
### Hệ thống giám sát – cảnh báo – điều khiển thiết bị IoT cho nhà thông minh  
(Built with **Node.js**, **Express**, **SQL Server**, **EJS**, **Aurora UI**)

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Web-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-SQL%20Server-red?style=for-the-badge" />
  <img src="https://img.shields.io/badge/IoT-ESP32-orange?style=for-the-badge" />
</p>

---

## ✨ Giới thiệu dự án

**Smart Home Monitoring & Alert System** là hệ thống giám sát môi trường theo thời gian thực kết hợp dashboard trực quan, cảnh báo tự động, và khả năng điều khiển thiết bị IoT từ xa.

Ứng dụng có thể chạy bằng:
- ESP32 + cảm biến thực  
- Simulator Node.js gửi dữ liệu ngẫu nhiên  
- Giao diện web full UI Aurora neon  

---

## 🚀 Tính năng nổi bật

### 🔍 Giám sát realtime
- 🌡 Nhiệt độ  
- 💧 Độ ẩm  
- 🌫 PM2.5  
- 🔥 Khí gas  

Cập nhật dữ liệu mỗi 2–5 giây.

---

### 🚨 Hệ thống cảnh báo thông minh
| Thông số | Mức cảnh báo | Hành động |
|---------|---------------|-----------|
| Gas | > 120 ppm | 🔴 Báo động nguy hiểm |
| PM2.5 | > 150 µg/m³ | 🟠 Cảnh báo chất lượng không khí |
| Temp | > 50°C | 🔥 Cảnh báo cháy |
| Humidity | <40% / >90% | ⚠ Môi trường không ổn định |

---

### 🛠 Điều khiển thiết bị IoT
- Điều khiển đèn, quạt, motor  
- Giao diện nút bấm nhanh  
- Hoạt động qua API `/control-device`

---

### 📜 Lịch sử dữ liệu (SQL Server)
- Lưu dữ liệu theo từng cảm biến  
- Lọc theo ngày, loại sensor, thiết bị  
- Phân trang  
- Export CSV  

---

### 👤 Hệ thống người dùng & phân quyền
- Đăng ký, đăng nhập  
- Role: **user**, **admin**, **super admin**  
- Super admin quản lý user & phân quyền  

---

## 🏗 Kiến trúc hệ thống

```
ESP32 / Simulator → API Server → SQL Server
                               ↓
                          Dashboard UI
                       (Realtime + History)
                               ↓
                        Alert & Control
```

---

## 🧱 Công nghệ sử dụng

### **Backend**
- Node.js  
- Express.js  
- express-session  
- dotenv  
- mssql  

### **Frontend**
- EJS  
- Aurora CSS UI  
- Chart.js  
- Fetch API  

### **Database**
- SQL Server 2022 / Express

### **IoT**
- ESP32  
- Node.js Simulator  

---

## 📂 Cấu trúc thư mục

```
📦 SmartHome-IoT
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── adminController.js
│   ├── sensorController.js
|   └── weatherController.js
├── middlewares/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Device.js
│   ├── Sensor.js
│   └── SensorData.js
├── public/
│   ├── css/main.css
│   ├── js/aurora.js
│   └── js/main.js
├── routes/
│   ├── sensors.js
│   ├── auth.js
│   ├── index.js
|   ├── admin.js
|   └── weather.js
|
├── services/weatherService.js
|
├── views/
|   ├── auth/
|   |   ├── login.ejs
|   |   └── register.ejs
│   ├── index.ejs
│   ├── dashboard.ejs
│   ├── panel.ejs
|   ├── 404.ejs
|   ├── admin_users.ejs
|   ├── error.ejs
│   └── history.ejs
├── simulate/
│   ├── nor_sim.js
│   └── alarm_sim.js
├── .env
├── index.js
└── README.md
```

---

## ⚙️ Hướng dẫn cài đặt

### 1️⃣ Clone dự án
```sh
git clone https://github.com/kain047/SmartHome-IOT-N3-22TD111.git
cd SmartHome-IoT
```

### 2️⃣ Cài đặt dependencies
```sh
npm install
```

### 3️⃣ Tạo file `.env`
```env
DB_USER=sa
DB_PASSWORD=your_password
DB_SERVER=localhost
DB_DATABASE=LHU_Auth
DB_PORT=1433
SESSION_SECRET=yourSecretKey
```

### 4️⃣ Chạy server
```sh
node index.js
```

---

## 📡 Mô phỏng dữ liệu IoT

### Chạy mô phỏng chế độ thường:
```sh
node simulate/nor_sim.js
```

### Chạy mô phỏng chế độ báo động:
```sh
node simulate/alarm_sim.js
```
```sh
node simulate/nor_sim.js
```

Mỗi lần simulator chạy → gửi POST đến API:
```json
POST /api/sensors/data
{
  "sensorId": 1,
  "value": 27.3
}
```

---

## 🗄 Cấu trúc Database

### **Users**
| Column | Type |
|--------|------|
| UserID | int |
| Username | nvarchar |
| Email | nvarchar |
| Password | nvarchar |
| Role | nvarchar |
| CreatedDate | datetime |

### **Devices**
| Column | Type |
|--------|------|
| DeviceID | int |
| UserID | int |
| Name | nvarchar |
| DeviceType | int |
| Status | int |
| CreatedAt | datetime |

### **Sensors**
| Column | Type |
|--------|------|
| SensorID | int |
| DeviceID | int |
| Type | nvarchar |
| Unit | nvarchar |

### **SensorData**
| Column | Type |
|--------|------|
| DataID | int |
| SensorID | int |
| Value | float |
| Timestamp | datetime |

---

## 🖼 Ảnh giao diện (khuyến nghị)

Bạn có thể tạo thư mục:

```
/images/dashboard.png
/images/panel.png
/images/history.png
```

Rồi thêm:

```markdown
### 📊 Dashboard
![Dashboard](images/dashboard.png)

### 🛠 Panel
![Panel](images/panel.png)

### 📜 History
![History](images/history.png)
```

---

## 🗺 Roadmap dự án

- [ ] Hỗ trợ MQTT  
- [ ] Thêm Mobile App (Flutter / React Native)  
- [ ] Thêm hệ thống automation rule  
- [ ] Tích hợp thông báo Telegram / Zalo  
- [ ] AI phát hiện bất thường dữ liệu  

---

## 📑 Tài liệu thiết kế hệ thống (System Design)

### 1️⃣ Kiến trúc tổng thể

Hệ thống được thiết kế theo mô hình 3 lớp:

```text
[Thiết bị IoT / Simulator]
       |
       |  HTTP (REST API, JSON)
       v
[Node.js + Express Backend]
       |
       |  T-SQL (mssql driver)
       v
[SQL Server Database]
       ^
       |
[Web Client (EJS + CSS + JS)]

---

## 👨‍💻 Tác giả

**Đặng Nguyễn Trung Nguyên**  
Lac Hong University – Smart Home Research  
2025  

---

## 📄 License  
MIT License – sử dụng tự do cho học tập & nghiên cứu.

