/* ===============================
   🔥 XÓA BẢNG THEO ĐÚNG THỨ TỰ
================================ */

IF OBJECT_ID('SensorData', 'U') IS NOT NULL DROP TABLE SensorData;
IF OBJECT_ID('Sensors', 'U') IS NOT NULL DROP TABLE Sensors;
IF OBJECT_ID('Devices', 'U') IS NOT NULL DROP TABLE Devices;
IF OBJECT_ID('Users', 'U') IS NOT NULL DROP TABLE Users;



/* ===============================
   🔥 USERS TABLE
================================ */

CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(200) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(200),
    Role NVARCHAR(20) DEFAULT 'user',
    CreatedDate DATETIME DEFAULT GETDATE()
);



/* ===============================
   🔥 DEVICES TABLE
   DeviceType: 
   1 = Thiết bị đo (Temperature, Humidity, Dust, Gas)
   2 = Quạt
   3 = Đèn
================================ */

CREATE TABLE Devices (
    DeviceID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    DeviceType INT NOT NULL,
    Status BIT DEFAULT 0,
    CreatedDate DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Devices_Users FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE
);



/* ===============================
   🔥 SENSORS TABLE
   Mỗi sensor gắn vào một Device
================================ */

CREATE TABLE Sensors (
    SensorID INT IDENTITY(1,1) PRIMARY KEY,
    DeviceID INT NOT NULL,
    Type NVARCHAR(50) NOT NULL,   -- Temperature / Humidity / PM2.5 / Gas / Power
    Unit NVARCHAR(20),
    Description NVARCHAR(300),

    CONSTRAINT FK_Sensors_Devices FOREIGN KEY (DeviceID)
        REFERENCES Devices(DeviceID) ON DELETE CASCADE
);



/* ===============================
   🔥 SENSOR DATA TABLE
   Lưu lịch sử giá trị đọc
================================ */

CREATE TABLE SensorData (
    DataID INT IDENTITY(1,1) PRIMARY KEY,
    SensorID INT NOT NULL,
    Value FLOAT NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_SensorData_Sensors FOREIGN KEY (SensorID)
        REFERENCES Sensors(SensorID) ON DELETE CASCADE
);


INSERT INTO Sensors (DeviceID, Type, Unit, CreatedAt)
VALUES (1, 'Temperature', '°C', GETDATE());

INSERT INTO Sensors (DeviceID, Type, Unit, CreatedAt)
VALUES (1, 'Humidity', '%', GETDATE());

INSERT INTO Sensors (DeviceID, Type, Unit, CreatedAt)
VALUES (1, 'PM2.5', 'µg/m³', GETDATE());

INSERT INTO Sensors (DeviceID, Type, Unit, CreatedAt)
VALUES (1, 'Gas', 'ppm', GETDATE());