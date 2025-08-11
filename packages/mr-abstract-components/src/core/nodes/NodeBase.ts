import { IReactiveController } from "../../controllers/IReactiveController.js";
import { IReactiveControllerHost } from "../../controllers/ReactiveControllerHost.js";
import { INode } from "./INode.js";
import { INodeRelations } from "../INodeReleations/INodeRelations.js";
import { IVisualNode } from "./IVisualNode.js";
import { INodeVisitor } from "./node/INodeVisitor.js";
import { Vector2 } from "@my-graphics/math";

 
export abstract class NodeBase implements INode {
  public id: string;
  public children: INode[]; // Assuming children is an array of INode
  name: string | undefined;
  updateComplete: Promise<boolean>;

  constructor(id: string) {
    // super(); // Remove this if not extending another class
    this.id = id;
    this.children = [];
    this.updateComplete = Promise.resolve(true);
  }
  SetId(id: string): void {
    throw new Error("Method not implemented.");
  }
  GetId(): string {
    throw new Error("Method not implemented.");
  }
  GetHost(): IReactiveControllerHost<INode> {
    throw new Error("Method not implemented.");
  }
  GetPosition(): Vector2;
  GetPosition(): Vector2;
  GetPosition(): import("@my-graphics/math").Vector2 {
    throw new Error("Method not implemented.");
  }
  SetPosition(position: Vector2): void {
    throw new Error("Method not implemented.");
  }
  SetDirection(direction: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetDirection(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetScale(scale: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetScale(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetTranslate(offset: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetTranslate(): Vector2 {
    throw new Error("Method not implemented.");
  }
  SetRotation(rotation: Vector2): void {
    throw new Error("Method not implemented.");
  }
  GetRotation(): Vector2 {
    throw new Error("Method not implemented.");
  }
  AddReactiveController(controller: IReactiveController): void {
    throw new Error("Method not implemented.");
  }
  RemoveReactiveController(controller: IReactiveController): void {
    throw new Error("Method not implemented.");
  }
  accept(visitor: { visit(n: INode): void; }): unknown {
    throw new Error("Method not implemented.");
  }

  Id(): string {
    return this.id;
  }
  GetName(): string {
    return this.name ?? "";
  }
  GetParent(): INode {
    throw new Error("Method not implemented.");
  }
  GetTags(): string[] {
    throw new Error("Method not implemented.");
  }
  GetMetadata(): Record<string, unknown> {
    throw new Error("Method not implemented.");
  }
  GetChildren(): Array<INode> {
    return this.children;
  }
  acceptVisitor(visitor: INodeVisitor): IVisualNode {
    throw new Error("Method not implemented.");
  }
  SetReat(host: any): void {
    throw new Error("Method not implemented.");
  }
  GetReactiveControllerHost(): IReactiveControllerHost<INode> {
    throw new Error("Method not implemented.");
  }
  SetMetaData?(metadata: Record<string, unknown>): void {
    throw new Error("Method not implemented.");
  }
  GetMetaData?(): Record<string, unknown> {
    throw new Error("Method not implemented.");
  }
  addController(controller: IReactiveController): void {
    throw new Error("Method not implemented.");
  }
  removeController(controller: IReactiveController): void {
    throw new Error("Method not implemented.");
  }
  requestUpdate(): void {
    throw new Error("Method not implemented.");
  }
  // IReactiveController (no-op in this base)
  hostConnected(): void {}
  hostDisconnected(): void {}
  hostUpdate?(): void {}
  hostUpdated?(): void {}
}
