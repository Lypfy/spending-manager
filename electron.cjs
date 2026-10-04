const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  // Tạo cửa sổ Desktop chính của phần mềm
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 650,
    title: 'SpendFlow — Quản Lý Chi Tiêu Cá Nhân',
    backgroundColor: '#0b0f19',
    show: false, // Ẩn lúc đầu để tránh chớp trắng, khi load xong mới hiện
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Khi giao diện đã sẵn sàng hiển thị thì mở cửa sổ lên
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Kiểm tra xem đang chạy ở chế độ phát triển (Dev) hay đã đóng gói
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    // Đang phát triển: load trực tiếp từ máy chủ Vite
    mainWindow.loadURL('http://127.0.0.1:5173');
  } else {
    // Khi đã đóng gói thành file .exe: load từ thư mục dist đã build
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// Khi Electron đã khởi động xong trong hệ điều hành Windows
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Thoát phần mềm khi người dùng bấm dấu X đóng tất cả cửa sổ
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
