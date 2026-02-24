import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { NotFoundError } from "@/lib/api/errors";

type TableName = keyof Database["public"]["Tables"];

/**
 * Base service providing common CRUD operations.
 * Extend this for domain-specific logic.
 */
export abstract class BaseService<T extends TableName> {
  constructor(
    protected supabase: SupabaseClient<Database>,
    protected tableName: T
  ) {}

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id" as never, id as never)
      .single();

    if (error || !data) {
      throw new NotFoundError(this.tableName);
    }
    return data;
  }

  async findMany(options: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    ascending?: boolean;
    filters?: Record<string, unknown>;
  }) {
    const { page = 1, pageSize = 20, orderBy = "created_at", ascending = false, filters } = options;
    const offset = (page - 1) * pageSize;

    let query = this.supabase
      .from(this.tableName)
      .select("*", { count: "exact" });

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== null && value !== "") {
          query = query.eq(key as never, value as never);
        }
      }
    }

    query = query.order(orderBy as never, { ascending }).range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data ?? [], total: count ?? 0 };
  }

  async create(payload: Database["public"]["Tables"][T]["Insert"]) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert(payload as never)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, payload: Database["public"]["Tables"][T]["Update"]) {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(payload as never)
      .eq("id" as never, id as never)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundError(this.tableName);
    }
    return data;
  }

  async delete(id: string) {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id" as never, id as never);

    if (error) throw error;
    return { success: true };
  }
}
