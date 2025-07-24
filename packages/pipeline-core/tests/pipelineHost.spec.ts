import { describe, it, expect, afterEach, beforeEach } from "vitest";
import { container, DependencyContainer } from "tsyringe";
import { PipelineHost } from "../src/core/PipelineHost";
import { Pipeline } from "../src/core/Pipeline";
import { IPipeline } from "../src/core/IPipeline";
import { IData } from "../src/core/IData";

class DummyPipeline extends Pipeline<IData> {}

describe("PipelineHost", () => {
  let scopedContainer: DependencyContainer;

  beforeEach(() => {
    scopedContainer = container.createChildContainer();
  });

  afterEach(() => {
    scopedContainer.reset();
  });

  it("should register and execute pipelines", async () => {
    scopedContainer.register<IPipeline<IData>>("RoutablePipelines", { useClass: DummyPipeline });
    const host = new PipelineHost(scopedContainer);
    await host.start();

    const result = await host.execute("DummyPipeline", { context: { test: true } });
    expect(result.context.test).toBe(true);
    expect(host.getRegistered()).toContain("DummyPipeline");
  });

  it("should throw on unknown pipeline", async () => {
    const host = new PipelineHost(scopedContainer);
    await host.start();
    await expect(host.execute("UnknownPipeline", { context: {} })).rejects.toThrow();
  });

  it("should clear pipelines on stop", async () => {
    const host = new PipelineHost(scopedContainer);
    await host.start();
    await host.stop();
    expect(host.getRegistered()).toEqual([]);
  });
});