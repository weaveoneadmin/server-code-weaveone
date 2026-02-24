import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { BaseService } from "./base.service";

export class StyleService extends BaseService<"styles"> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, "styles");
  }

  async findByOrder(orderId: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { order_id: orderId } });
  }
}
