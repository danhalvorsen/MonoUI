import { describe, it, expect } from "vitest";
import { Node } from "../src/index.js";

describe("N-ary Node - mutations", () => {
  it("add/insertAt maintain order", () => {
    const A = new Node("A", {});
    const B = new Node("B", {});
    const D = new Node("D", {});
    A.add(B, D);
    const C = new Node("C", {});
    A.insertAt(1, C);
    expect(A.children.map(n => n.id)).toEqual(["B", "C", "D"]);
  });

  it("remove and clear detach correctly", () => {
    const A = new Node("A", {});
    const B = new Node("B", {});
    const C = new Node("C", {});
    A.add(B, C);
    expect(B.parent?.id).toBe("A");
    expect(A.remove(B)).toBe(true);
    expect(B.parent).toBeNull();
    expect(A.children.map(n => n.id)).toEqual(["C"]);
    A.clear();
    expect(A.children.length).toBe(0);
    expect(C.parent).toBeNull();
  });

  it("move node between parents", () => {
    const P1 = new Node("P1", {});
    const P2 = new Node("P2", {});
    const X = new Node("X", {});
    P1.add(X);
    expect(X.parent?.id).toBe("P1");
    P2.add(X);
    expect(X.parent?.id).toBe("P2");
    expect(P1.children.length).toBe(0);
    expect(P2.children[0]?.id).toBe("X");
  });

  it("prevents self-child and cycles", () => {
    const A = new Node("A", {});
    const B = new Node("B", {});
    A.add(B);
    expect(() => A.add(A as any)).toThrowError();
    // make a cycle attempt: add A under B (A is ancestor of B)
    expect(() => B.add(A as any)).toThrowError();
  });

  it("path of root is itself", () => {
    const A = new Node("A", {});
    expect(A.path().map(n => n.id)).toEqual(["A"]);
  });
});
