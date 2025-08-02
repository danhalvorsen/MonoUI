import "reflect-metadata";
import { RuleResult } from "./RuleResult.js";
import { ITemplate } from "abstract-template";

/**
 * Base class for all validation rules
 */
export abstract class Rule<T> {
  /** Unique rule identifier (used in results) */
  public readonly name: string;

  /** Optional custom message template */
  public messageTemplate?: ITemplate;
  public message?: string;

  constructor(name: string) {
    this.name = name;
  }

  abstract validate(value: T, path: string): RuleResult;
}