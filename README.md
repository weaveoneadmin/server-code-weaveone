# WeaveOne Server

面向服装行业的 SaaS 协作平台后端服务。

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript 5
- **数据库**: Supabase (PostgreSQL)
- **验证**: Zod
- **认证**: Supabase Auth

## 项目结构

```
src/
├── app/
│   ├── api/v1/                  # API 路由 (v1 版本)
│   │   ├── health/              # 健康检查
│   │   ├── orders/              # 接单组 (Nora)
│   │   ├── styles/              # 款式组 (Cleo)
│   │   ├── fabrics/             # 面料组 (Faye)
│   │   ├── crafts/              # 工艺组 (Tess)
│   │   ├── patterns/            # 版型组 (Pax)
│   │   ├── deliveries/          # 交付组 (Odin)
│   │   └── workflow/            # 工作流管理 (One管家)
│   │       ├── advance/         # 推进流程
│   │       ├── rollback/        # 回退流程
│   │       ├── stages/          # 阶段定义
│   │       └── timeline/        # 流程时间线
│   └── ...
├── lib/
│   ├── api/                     # API 工具 (响应/错误/验证)
│   ├── constants/               # 常量 (工作流定义)
│   ├── supabase/                # Supabase 客户端
│   └── validations/             # Zod 验证 Schema
├── services/                    # 业务逻辑服务层
├── types/                       # TypeScript 类型定义
└── middleware.ts                # Next.js 中间件
supabase/
└── migrations/                  # 数据库迁移文件
```

## 标准协作流程

```
接单组(Nora) → 款式组(Cleo) → 面料组(Faye) → 工艺组(Tess) → 版型组(Pax) → 交付组(Odin)
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写 Supabase 配置：

```bash
cp .env.example .env.local
```

### 3. 初始化数据库

在 Supabase Dashboard 的 SQL Editor 中执行 `supabase/migrations/001_initial_schema.sql`。

### 4. 启动开发服务器

```bash
npm run dev
```

## API 接口

| 方法   | 路径                                 | 说明           |
| ------ | ------------------------------------ | -------------- |
| GET    | `/api/v1/health`                     | 健康检查       |
| GET    | `/api/v1/orders`                     | 获取订单列表   |
| POST   | `/api/v1/orders`                     | 创建订单       |
| GET    | `/api/v1/orders/:id`                 | 获取订单详情   |
| PATCH  | `/api/v1/orders/:id`                 | 更新订单       |
| DELETE | `/api/v1/orders/:id`                 | 删除订单       |
| GET    | `/api/v1/styles`                     | 获取款式列表   |
| POST   | `/api/v1/styles`                     | 创建款式       |
| GET    | `/api/v1/styles/:id`                 | 获取款式详情   |
| PATCH  | `/api/v1/styles/:id`                 | 更新款式       |
| DELETE | `/api/v1/styles/:id`                 | 删除款式       |
| GET    | `/api/v1/fabrics`                    | 获取面料列表   |
| POST   | `/api/v1/fabrics`                    | 创建面料       |
| GET    | `/api/v1/crafts`                     | 获取工艺列表   |
| POST   | `/api/v1/crafts`                     | 创建工艺       |
| GET    | `/api/v1/patterns`                   | 获取版型列表   |
| POST   | `/api/v1/patterns`                   | 创建版型       |
| GET    | `/api/v1/deliveries`                 | 获取交付列表   |
| POST   | `/api/v1/deliveries`                 | 创建交付       |
| GET    | `/api/v1/workflow/stages`            | 获取工作流阶段 |
| POST   | `/api/v1/workflow/advance`           | 推进工作流     |
| POST   | `/api/v1/workflow/rollback`          | 回退工作流     |
| GET    | `/api/v1/workflow/timeline/:orderId` | 获取流程时间线 |

## 统一响应格式

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "timestamp": "2026-02-24T00:00:00.000Z"
}
```

分页响应：

```json
{
  "success": true,
  "data": [...],
  "error": null,
  "timestamp": "...",
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```
