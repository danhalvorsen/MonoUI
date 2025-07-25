// File: packages/pipes/code-maintenance-pipe/GenerateBarrelPipe/src/GenerateBarrelPipe.ts
import { IPipe } from "@mr/pipeline-core";
import { IData } from "@mr/pipeline-core";
import fs from "fs";
import path from "path";
import { Project } from "ts-morph";

export interface GenerateBarrelData extends IData {
  context: {
    targetDir: string;
    fileCount?: number;
  };
}

export class GenerateBarrelPipe implements IPipe<GenerateBarrelData, GenerateBarrelData> {
  name = "GenerateBarrelPipe";

  async execute(data: GenerateBarrelData): Promise<GenerateBarrelData> {
    const { targetDir } = data.context;
    const project = new Project();
    const files = fs.readdirSync(targetDir).filter(f => f.endsWith(".ts") && f !== "index.ts");

    const exports: string[] = [];

    for (const file of files) {
      const filePath = path.join(targetDir, file);
      const sourceFile = project.addSourceFileAtPath(filePath);

      const baseName = path.basename(file, ".ts");
      const hasExports = sourceFile.getExportedDeclarations().size > 0;

      if (hasExports) {
        exports.push(`export * from './${baseName}';`);
      }
    }

    const barrelPath = path.join(targetDir, "index.ts");
    fs.writeFileSync(barrelPath, exports.join("\n") + "\n");

    data.context.fileCount = files.length;
    return data;
  }
}
