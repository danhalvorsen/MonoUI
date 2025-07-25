import { Project, SyntaxKind } from 'ts-morph';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TokenServiceOptions {
  name: string;
  tokensPath: string;
  outputDir: string;
}

export function generateTokenService({
  name,
  tokensPath,
  outputDir,
}: Omit<TokenServiceOptions, 'interfacePath'>) {
  const project = new Project();
  const source = project.addSourceFileAtPath(tokensPath);
  const variable = source.getVariableDeclarationOrThrow('ColorTokens');
  const obj = variable.getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression);

  const props = obj.getProperties();
  const classLines = [
    "import { injectable } from 'tsyringe';",
    `import type { ${name} } from 'mr-style/tokens/${name.toLowerCase()}'`,
    "",
    "@injectable()",
    `export class ${name}Service implements ${name} {`
  ];

  for (const prop of props) {
    if (prop.getKind() === SyntaxKind.PropertyAssignment) {
      const property = prop.asKindOrThrow(SyntaxKind.PropertyAssignment);
      const name = property.getName();
      const initializer = property.getInitializer();
      
      if (initializer) {
        const value = initializer.getText();
        classLines.push(`  ${name} = ${value};`);
      } else {
        console.warn(`Skipping property ${name} - no initializer found`);
      }
    } else if (prop.getKind() === SyntaxKind.SpreadAssignment) {
      console.warn('Skipping spread assignment in token definition');
    } else if (prop.getKind() === SyntaxKind.ShorthandPropertyAssignment) {
      const shorthand = prop.asKindOrThrow(SyntaxKind.ShorthandPropertyAssignment);
      const name = shorthand.getName();
      classLines.push(`  ${name} = ${name};`); // For shorthand properties like { a, b }
    } else {
      console.warn(`Skipping unsupported property kind: ${prop.getKindName()}`);
    }
  }

  classLines.push("}");

  const outputPath = path.resolve(outputDir, `${name}Service.ts`);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, classLines.join('\n'));
  console.log(`✔ Generated: ${outputPath}`);
}

async function main() {
  try {
    const args = process.argv.slice(2);
    if (args.length < 3) {
      console.error('Usage: mr-style-cli <token-name> <interface-path> <output-dir>');
      process.exit(1);
    }

    const [tokenName, outputDir] = args;
    const tokensPath = path.resolve(__dirname, '../../mr-style/src/tokens', `${tokenName.toLowerCase()}.tokens.ts`);
    
    // Ensure the output directory exists
    fs.mkdirSync(outputDir, { recursive: true });

    await generateTokenService({
      name: tokenName,
      tokensPath,
      outputDir,
    });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Export the main function for programmatic usage
export { main };
