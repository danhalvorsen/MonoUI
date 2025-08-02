import { IWorkDefinition, IWorkContext, IWorkResult } from './strategies/IWorkDefinition.js';

export class WorkOrchestrator {
  private strategy: IWorkDefinition;
  
  constructor(strategy: IWorkDefinition) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy: IWorkDefinition): void {
    this.strategy = strategy;
  }
  
  async executeWork(context: IWorkContext): Promise<IWorkResult> {
    return await this.strategy.execute(context);
  }
}