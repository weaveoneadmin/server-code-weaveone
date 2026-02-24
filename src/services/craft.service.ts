import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { BaseService } from "./base.service";

export class CraftService extends BaseService<"crafts"> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, "crafts");
  }

  async findByOrder(orderId: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { order_id: orderId } });
  }
}
