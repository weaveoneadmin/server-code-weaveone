import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { BaseService } from "./base.service";

export class OrderService extends BaseService<"orders"> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, "orders");
  }

  async findByStatus(status: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { status } });
  }

  async findByStage(stage: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { current_stage: stage } });
  }

  async search(keyword: string, page = 1, pageSize = 20) {
    const offset = (page - 1) * pageSize;

    const { data, error, count } = await this.supabase
      .from("orders")
      .select("*", { count: "exact" })
      .or(`order_number.ilike.%${keyword}%,client_name.ilike.%${keyword}%`)
      .order("created_at", { ascending: false })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;
    return { data: data ?? [], total: count ?? 0 };
  }
}
