import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { BaseService } from "./base.service";

export class DeliveryService extends BaseService<"deliveries"> {
  constructor(supabase: SupabaseClient<Database>) {
    super(supabase, "deliveries");
  }

  async findByOrder(orderId: string, page = 1, pageSize = 20) {
    return this.findMany({ page, pageSize, filters: { order_id: orderId } });
  }
}
