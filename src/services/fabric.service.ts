import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { BaseService } from "./base.service";

export class FabricService extends BaseService<"fabrics"> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, "fabrics");
  }

  async findByOrder(orderId: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { order_id: orderId } });
  }
}
