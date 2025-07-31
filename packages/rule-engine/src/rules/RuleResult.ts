import "reflect-metadata";
export interface RuleResult {
  isValid: boolean;
  ruleName: string;
  path: string;
  message?: string;
}
