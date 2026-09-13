/**
 * Lana SDK - Workflow Designer Engine
 */
export interface WorkflowStep {
  id: string;
  type: string;
  config: Record<string, any>;
}

export class WorkflowDesigner {
  private workflows: Map<string, WorkflowStep[]> = new Map();

  createWorkflow(id: string, steps: WorkflowStep[]) {
    this.workflows.set(id, steps);
    return steps;
  }

  getWorkflow(id: string) {
    return this.workflows.get(id);
  }
}
