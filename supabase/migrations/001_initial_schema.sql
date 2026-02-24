-- WeaveOne 初始数据库 Schema
-- 服装行业 SaaS 协作平台

-- ============================================================
-- 枚举类型
-- ============================================================

CREATE TYPE order_status AS ENUM ('draft', 'active', 'on_hold', 'completed', 'cancelled');
CREATE TYPE workflow_stage AS ENUM ('order_intake', 'style_design', 'fabric_selection', 'craft_planning', 'pattern_making', 'delivery');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');

-- ============================================================
-- 订单表 (接单组 - Nora)
-- ============================================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_contact TEXT,
  description TEXT,
  requirements JSONB,
  status order_status NOT NULL DEFAULT 'draft',
  current_stage workflow_stage NOT NULL DEFAULT 'order_intake',
  priority priority_level NOT NULL DEFAULT 'medium',
  deadline TIMESTAMPTZ,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 款式表 (款式组 - Cleo)
-- ============================================================

CREATE TABLE styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  style_number TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  design_images JSONB,
  specifications JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 面料表 (面料组 - Faye)
-- ============================================================

CREATE TABLE fabrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  fabric_code TEXT NOT NULL,
  material TEXT,
  color TEXT,
  weight TEXT,
  width TEXT,
  supplier TEXT,
  unit_price NUMERIC(10, 2),
  quantity NUMERIC(10, 2),
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 工艺表 (工艺组 - Tess)
-- ============================================================

CREATE TABLE crafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  process_name TEXT NOT NULL,
  process_code TEXT NOT NULL,
  description TEXT,
  steps JSONB,
  equipment JSONB,
  estimated_hours NUMERIC(8, 2),
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 版型表 (版型组 - Pax)
-- ============================================================

CREATE TABLE patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  pattern_code TEXT NOT NULL,
  version TEXT NOT NULL DEFAULT '1.0',
  size_range JSONB,
  grading_rules JSONB,
  file_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 交付表 (交付组 - Odin)
-- ============================================================

CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  delivery_number TEXT NOT NULL,
  shipment_method TEXT,
  tracking_number TEXT,
  estimated_date TIMESTAMPTZ,
  actual_date TIMESTAMPTZ,
  quantity INTEGER,
  quality_check JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 工作流日志表 (总控组 - One管家)
-- ============================================================

CREATE TABLE workflow_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  from_stage workflow_stage NOT NULL,
  to_stage workflow_stage NOT NULL,
  action TEXT NOT NULL,
  operator_id UUID NOT NULL REFERENCES auth.users(id),
  notes TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 索引
-- ============================================================

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_current_stage ON orders(current_stage);
CREATE INDEX idx_orders_created_by ON orders(created_by);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

CREATE INDEX idx_styles_order_id ON styles(order_id);
CREATE INDEX idx_fabrics_order_id ON fabrics(order_id);
CREATE INDEX idx_crafts_order_id ON crafts(order_id);
CREATE INDEX idx_patterns_order_id ON patterns(order_id);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_workflow_logs_order_id ON workflow_logs(order_id);
CREATE INDEX idx_workflow_logs_created_at ON workflow_logs(created_at);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE crafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_logs ENABLE ROW LEVEL SECURITY;

-- 已认证用户可以读取所有数据
CREATE POLICY "Authenticated users can read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read styles" ON styles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read fabrics" ON fabrics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read crafts" ON crafts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read patterns" ON patterns FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read deliveries" ON deliveries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read workflow_logs" ON workflow_logs FOR SELECT TO authenticated USING (true);

-- 已认证用户可以创建数据
CREATE POLICY "Authenticated users can create orders" ON orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create styles" ON styles FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create fabrics" ON fabrics FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create crafts" ON crafts FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create patterns" ON patterns FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create deliveries" ON deliveries FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authenticated users can create workflow_logs" ON workflow_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = operator_id);

-- 已认证用户可以更新数据
CREATE POLICY "Authenticated users can update orders" ON orders FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update styles" ON styles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update fabrics" ON fabrics FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update crafts" ON crafts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update patterns" ON patterns FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can update deliveries" ON deliveries FOR UPDATE TO authenticated USING (true);

-- 只有创建者可以删除
CREATE POLICY "Creators can delete orders" ON orders FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete styles" ON styles FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete fabrics" ON fabrics FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete crafts" ON crafts FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete patterns" ON patterns FOR DELETE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete deliveries" ON deliveries FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- ============================================================
-- 自动更新 updated_at 触发器
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER styles_updated_at BEFORE UPDATE ON styles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER fabrics_updated_at BEFORE UPDATE ON fabrics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER crafts_updated_at BEFORE UPDATE ON crafts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER patterns_updated_at BEFORE UPDATE ON patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at();
