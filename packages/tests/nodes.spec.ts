import { describe, it, expect } from "vitest";
import { Node, bfs, dfs, visit } from "../src/index.js";

describe("N-ary Node - traversal & basic", () => {
  const tree = () => {
    //       A
    //     / | \
    //    B  C  D
    //      / \
    //     E   F
    const A = new Node("A", { v: 1 });
    const B = new Node("B", { v: 2 });
    const C = new Node("C", { v: 3 });
    const D = new Node("D", { v: 4 });
    const E = new Node("E", { v: 5 });
    const F = new Node("F", { v: 6 });
    A.add(B, C, D);
    C.add(E, F);
    return { A, B, C, D, E, F };
  };

  it("iterates DFS by default", () => {
    const { A } = tree();
    const order = [...A].map(n => n.id);
    expect(order).toEqual(["A", "B", "C", "E", "F", "D"]);
  });

  it("supports bfs/dfs helpers", () => {
    const { A } = tree();
    expect([...dfs(A)].map(n => n.id)).toEqual(["A", "B", "C", "E", "F", "D"]);
    expect([...bfs(A)].map(n => n.id)).toEqual(["A", "B", "C", "D", "E", "F"]);
  });

  it("visitor enter/leave and short-circuit", () => {
    const { A } = tree();
    const sequence: string[] = [];
    visit(A, {
      enter(n, ctx) {
        sequence.push(`enter:${n.id}`);
        if (n.id === "C") ctx.stop();
      },
      leave(n) {
        sequence.push(`leave:${n.id}`);
      },
    });
    // once we hit C, traversal should stop
    expect(sequence).toEqual(["enter:A", "enter:B", "leave:B", "enter:C"]);
  });

  it("supports find/findById/path", () => {
    const { A, F } = tree();
    expect(A.findById("F")?.id).toBe("F");
    expect(A.find(n => (n as any).data.v === 6)?.id).toBe("F");
    expect(F.path().map(n => n.id)).toEqual(["A", "C", "F"]);
  });
});
