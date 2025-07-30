 
import { IPipe } from "@mr/pipeline-core";
import { IData } from "@packages/pipeline-core";
import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
 
export interface GenerateBarrelData extends IData {
  context: {
    targetDir: string;   // Directory where we generate index.ts
    fileCount?: number;  // Optional: count of processed files
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
        exports.push(`export * from './${baseName}.js';`);
      }
    }

    const barrelPath = path.join(targetDir, "index.ts");
    fs.writeFileSync(barrelPath, exports.join("\n") + "\n");

    data.context.fileCount = files.length;
    return data;
  }
}
