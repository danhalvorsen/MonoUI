// src/ruleCompilerOptions.ts

interface TsConfig {
  compilerOptions: {
    target?: string;
    module?: string;
    moduleResolution?: string;
  };
}

function validateCompilerOptions(config: TsConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  const options = config.compilerOptions;

  if (!options) {
    return { valid: false, errors: ['Missing "compilerOptions"'] };
  }

  if (options.target?.toLowerCase() !== 'es2021') {
    errors.push(`Expected "target": "ES2021" (case-insensitive), got "${options.target}"`);
  }

  // Accept both ESNext and NodeNext as valid module values
  if (options.module !== 'ESNext' && options.module !== 'NodeNext') {
    errors.push(`Expected "module" to be either "ESNext" or "NodeNext", got "${options.module}"`);
  }

  if (options.moduleResolution !== 'node') {
    errors.push(
      `Expected "moduleResolution": "node", got "${options.moduleResolution}"`
    );
  }

  return { valid: errors.length === 0, errors };
}

// Named exports
export { validateCompilerOptions, type TsConfig };

// Default export for backward compatibility
export default {
  validateCompilerOptions,
  TsConfig: {} as TsConfig
};
