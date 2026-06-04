# 租房平台系统

基于 React + Tailwind CSS + Python + Django + SQLite 构建的全栈租房平台系统，支持租客、房东、管理员三类用户角色。

## 功能特性

### 租客端
- 房源浏览（支持多条件筛选：区域、价格、户型、面积）
- 收藏房源
- 租赁申请
- 我的合同
- 消息中心

### 房东端
- 房源发布与管理
- 我的合同
- 消息中心
- 租赁申请审核

### 管理员端
- 房源审核
- 用户审核
- 申请管理

## 技术栈

**前端：**
- React 18
- React Router 6
- Tailwind CSS 3
- Axios
- Vite

**后端：**
- Django 4.2
- Django REST Framework
- SQLite
- JWT 认证

## 项目结构

```
0604-03/
├── backend/                 # 后端项目
│   ├── rental_platform/    # Django 项目配置
│   ├── users/              # 用户模块
│   ├── properties/         # 房源模块
│   ├── contracts/          # 合同模块
│   ├── messages/           # 消息模块
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── components/     # 公共组件
│   │   ├── contexts/       # 上下文
│   │   ├── layouts/        # 布局组件
│   │   ├── pages/          # 页面组件
│   │   │   ├── tenant/     # 租客端页面
│   │   │   ├── landlord/   # 房东端页面
│   │   │   ├── admin/      # 管理员端页面
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── utils/          # 工具函数
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 快速开始

### 环境要求

- Python 3.8+
- Node.js 16+
- npm 或 yarn

### 后端启动

1. 进入后端目录：
```bash
cd backend
```

2. 创建并激活虚拟环境（推荐）：
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# 或
venv\Scripts\activate  # Windows
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 数据库初始化：
```bash
# 生成迁移文件
python manage.py makemigrations

# 执行迁移
python manage.py migrate
```

5. 创建超级管理员（可选）：
```bash
python manage.py createsuperuser
```

6. 启动后端服务器（端口 8003）：
```bash
python manage.py runserver 8003
```

后端服务将运行在 `http://localhost:8003`

### 前端启动

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器（端口 5103）：
```bash
npm run dev
```

前端服务将运行在 `http://localhost:5103`

## 默认访问

- 前端地址：http://localhost:5103
- 后端 API 地址：http://localhost:8003
- Django 管理后台：http://localhost:8003/admin

## API 接口文档

### 认证接口
- `POST /api/users/login/` - 用户登录
- `POST /api/users/register/` - 用户注册
- `POST /api/users/login/refresh/` - 刷新 Token

### 用户接口
- `GET /api/users/me/` - 获取当前用户信息
- `GET /api/users/pending_users/` - 获取待审核用户（管理员）
- `POST /api/users/{id}/approve/` - 通过用户审核（管理员）
- `POST /api/users/{id}/reject/` - 拒绝用户审核（管理员）

### 房源接口
- `GET /api/properties/` - 获取房源列表
- `POST /api/properties/` - 发布房源
- `GET /api/properties/{id}/` - 获取房源详情
- `PUT /api/properties/{id}/` - 更新房源
- `POST /api/properties/{id}/approve/` - 审核通过房源（管理员）
- `POST /api/properties/{id}/reject/` - 审核拒绝房源（管理员）

### 收藏接口
- `GET /api/properties/favorites/` - 获取收藏列表
- `POST /api/properties/favorites/` - 添加收藏
- `DELETE /api/properties/favorites/remove/` - 取消收藏

### 申请接口
- `GET /api/properties/applications/` - 获取申请列表
- `POST /api/properties/applications/` - 提交租赁申请
- `POST /api/properties/applications/{id}/approve/` - 通过申请（房东）
- `POST /api/properties/applications/{id}/reject/` - 拒绝申请（房东）

### 合同接口
- `GET /api/contracts/` - 获取合同列表

### 消息接口
- `GET /api/messages/received/` - 获取收到的消息
- `GET /api/messages/sent/` - 获取发送的消息
- `POST /api/messages/` - 发送消息
- `POST /api/messages/{id}/mark_read/` - 标记已读

## 开发说明

### 端口说明
- 后端端口：8003
- 前端端口：5103

### 角色说明
- **tenant (租客)**：浏览房源、收藏、申请租赁、查看合同、消息
- **landlord (房东)**：发布房源、审核申请、管理合同、消息
- **admin (管理员)**：审核房源、审核用户、管理申请

### 注意事项
1. 首次运行需要执行数据库迁移
2. 管理员账号需要通过 `createsuperuser` 创建
3. 前端通过代理访问后端 API，避免跨域问题

## 许可证

MIT License
