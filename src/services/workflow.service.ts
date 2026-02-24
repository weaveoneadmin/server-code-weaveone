import { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/types/database";
import type { WorkflowStage } from "@/types/workflow";
import { AppError } from "@/lib/api/errors";
import { canTransition, getNextStage, WORKFLOW_STAGES } from "@/lib/constants/workflow";

export class WorkflowService {
  constructor(private supabase: SupabaseClient<Database>) {}

  private async getOrder(orderId: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      throw new AppError("订单不存在", 404, "NOT_FOUND");
    }
    return data as unknown as Tables<"orders">;
  }

  async advanceOrder(orderId: string, operatorId: string, notes?: string) {
    const order = await this.getOrder(orderId);

    if (order.status !== "active") {
      throw new AppError("只有进行中的订单才能推进流程", 400, "INVALID_STATUS");
    }

    const currentStage = order.current_stage as WorkflowStage;
    const nextStage = getNextStage(currentStage);

    if (!nextStage) {
      throw new AppError("订单已在最终阶段", 400, "ALREADY_FINAL_STAGE");
    }

    if (!canTransition(currentStage, nextStage)) {
      throw new AppError("无法推进到下一阶段", 400, "INVALID_TRANSITION");
    }

    const { error: updateError } = await this.supabase
      .from("orders")
      .update({
        current_stage: nextStage,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", orderId);

    if (updateError) throw updateError;

    await this.supabase.from("workflow_logs").insert({
      order_id: orderId,
      from_stage: currentStage,
      to_stage: nextStage,
      action: "advance",
      operator_id: operatorId,
      notes,
    } as never);

    return {
      orderId,
      previousStage: WORKFLOW_STAGES[currentStage],
      currentStage: WORKFLOW_STAGES[nextStage],
    };
  }

  async rollbackOrder(orderId: string, operatorId: string, targetStage: WorkflowStage, notes?: string) {
    const order = await this.getOrder(orderId);

    const currentStage = order.current_stage as WorkflowStage;
    const currentOrder = WORKFLOW_STAGES[currentStage].order;
    const targetOrder = WORKFLOW_STAGES[targetStage].order;

    if (targetOrder >= currentOrder) {
      throw new AppError("回退目标必须是之前的阶段", 400, "INVALID_ROLLBACK");
    }

    const { error: updateError } = await this.supabase
      .from("orders")
      .update({
        current_stage: targetStage,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", orderId);

    if (updateError) throw updateError;

    await this.supabase.from("workflow_logs").insert({
      order_id: orderId,
      from_stage: currentStage,
      to_stage: targetStage,
      action: "rollback",
      operator_id: operatorId,
      notes,
    } as never);

    return {
      orderId,
      previousStage: WORKFLOW_STAGES[currentStage],
      currentStage: WORKFLOW_STAGES[targetStage],
    };
  }

  async getOrderTimeline(orderId: string) {
    const { data, error } = await this.supabase
      .from("workflow_logs")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as unknown as Tables<"workflow_logs">[];
  }
}
