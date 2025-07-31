import { RuleResult } from "../rules/RuleResult.js";

export class ValidationResult {
    constructor(public results: RuleResult[]) {}
    get isValid(): boolean { return this.results.every(r => r.isValid); }
    get passed(): RuleResult[] { return this.results.filter(r => r.isValid); }
    get failed(): RuleResult[] { return this.results.filter(r => !r.isValid); }
  }