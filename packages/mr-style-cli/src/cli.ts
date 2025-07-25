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

  // Try to match a variable name containing the requested token name
  const variable = source.getVariableDeclarations().find(v =>
    v.getName().toLowerCase().includes(name.toLowerCase())
  ) ?? source.getVariableDeclarations()[0];

  if (!variable) {
    throw new Error(`No token variable found in ${tokensPath}`);
  }

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
      const propName = property.getName();
      const initializer = property.getInitializer();
      if (initializer) {
        const value = initializer.getText();
        classLines.push(`  ${propName} = ${value};`);
      } else {
        console.warn(`Skipping property ${propName} - no initializer found`);
      }
    } else if (prop.getKind() === SyntaxKind.SpreadAssignment) {
      console.warn('Skipping spread assignment in token definition');
    } else if (prop.getKind() === SyntaxKind.ShorthandPropertyAssignment) {
      const shorthand = prop.asKindOrThrow(SyntaxKind.ShorthandPropertyAssignment);
      const propName = shorthand.getName();
      classLines.push(`  ${propName} = ${propName};`);
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
    if (args.length < 2) {
      console.error('Usage: mr-style-cli <token-name> <output-dir>');
      process.exit(1);
    }

    const [tokenName, outputDir] = args;
    const tokensPath = path.resolve(__dirname, '../../mr-style/src/tokens', `${tokenName.toLowerCase()}.tokens.ts`);
    fs.mkdirSync(outputDir, { recursive: true });

    await generateTokenService({ name: tokenName, tokensPath, outputDir });
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

export { main };
