import { describe, it, expect } from "vitest";
import { IdentityClass } from "../implementations/IdentityClass.js";
import { Matrix } from "../implementations/Matrix.js";

describe("IdentityClass", () => {
  it("should return a 3x3 identity matrix", () => {
    const provider = new IdentityClass();
    const matrix = provider.createIdentityMatrix(3);
    expect(matrix.toFloat32Array()).toEqual(Matrix.identity(3).toFloat32Array());
  });

  it("should return a 4x4 identity matrix", () => {
    const provider = new IdentityClass();
    const matrix = provider.createIdentityMatrix(4);
    expect(matrix.toFloat32Array()).toEqual(Matrix.identity(4).toFloat32Array());
  });

  it("should return clones for 3x3 to prevent mutation issues", () => {
    const provider = new IdentityClass();
    const matrix1 = provider.createIdentityMatrix(3);
    const matrix2 = provider.createIdentityMatrix(3);
    matrix1.scale(2);
    expect(matrix1.equals(matrix2)).toBe(false);
  });

  it("should dynamically create identity for arbitrary sizes", () => {
    const provider = new IdentityClass();
    const matrix = provider.createIdentityMatrix(5);
    expect(matrix.toFloat32Array()[0]).toBe(1);
    expect(matrix.toFloat32Array()[6]).toBe(1);
  });

  it("should be compatible with Vitest setup", () => {
    expect(typeof describe).toBe("function");
    expect(typeof it).toBe("function");
  });
});
