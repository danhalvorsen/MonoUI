import { describe, it, expect } from "vitest";
import { Pipeline } from "../src/core/Pipeline";
import { Pipe } from "../src/core/Pipe";
import { IData } from "../src/core/IData";

describe("Pipeline", () => {
  it("should execute pipes in order", async () => {
    const pipeline = new Pipeline<IData>()
      .addPipe(new Pipe("Step1", async (d: IData) => { d.context.a = 1; return d; }))
      .addPipe(new Pipe("Step2", async (d: IData) => { d.context.b = 2; return d; }));

    const result = await pipeline.run({ context: {} as Record<string, any> });
    expect(result.context).toEqual({ a: 1, b: 2 });
  });

  it("should propagate errors from pipes", async () => {
    const pipeline = new Pipeline<IData>()
      .addPipe(new Pipe("ErrorStep", async () => { throw new Error("Boom"); }));

    await expect(pipeline.run({ context: {} })).rejects.toThrow("Boom");
  });

  it("should handle empty pipelines", async () => {
    const pipeline = new Pipeline<IData>();
    const result = await pipeline.run({ context: { x: 1 } });
    expect(result.context.x).toBe(1);
  });
});
