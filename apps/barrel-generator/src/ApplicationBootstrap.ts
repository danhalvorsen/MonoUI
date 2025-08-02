import { Result } from "@mr/design-patterns";
import { join } from "path";
import { ICommandLineParser } from "./input/CommandLine/ICommandLineParser.js";
import { ApplicationArgs } from "./models/ApplicationArgs.js";
import { IConfigProvider } from "./models/IConfigProvider.js";
import { IConfiguration } from "./models/IConfiguration.js";
import {
  BarrelGenerationStrategy,
  BarrelGenerationOptions,
} from "./processing/work/strategies/Barrel/BarrelGenerationStrategy.js";
import {
  IWorkContext,
  IWorkResult,
} from "./processing/work/strategies/IWorkDefinition.js";
import { WorkOrchestrator } from "./processing/work/WorkOrchestrator.js";
import { BarrelConfiguration } from "./models/BarrelConfiguration.js";

export class ApplicationBootstrap {
  private readonly configProvider: IConfigProvider;
  private readonly commandLineParser: ICommandLineParser;

  constructor(
    configProvider: IConfigProvider,
    commandLineParser: ICommandLineParser
  ) {
    this.configProvider = configProvider;
    this.commandLineParser = commandLineParser;
  }

  public async start<T extends IConfiguration>(): Promise<void> {
    try {
      const parsedArgs = this.commandLineParser.parse();
      this.logCommandLineArguments(parsedArgs);

      const config: T = await this.configProvider.getConfiguration<T>();
      console.log(`Configuration loaded successfully: ${config}`);

      const strategy = new BarrelGenerationStrategy();  

      const workOrchestrator = new WorkOrchestrator(
        strategy
      );

      const array = config.packages as Array<T>;
      if (!Array.isArray(array)) {
        console.error("Invalid packages configuration");
        return;
      }
      console.log(`There are ${array.length} packages specified to process`);
      if (array.length === 0) {
        console.log("No packages specified to process");
        return;
      }

      const options = {
        packagesPath: config.packagesPath as string,
        packagesList: Array.isArray(config.packages)
          ? (config.packages as string[])
          : [],
        dryRun: Boolean(config.dryRun) || parsedArgs.options.dryRun === true,
      };

      const results: Result<IWorkResult>[] = [];

      for (const packageName of options.packagesList) {
        console.log(`\nProcessing package: ${packageName}`);

        const workContext: IWorkContext = {
          packageName,
          packagePath:
            typeof config.packagesPath === "string" &&
            config.packagesPath.length > 0
              ? join(config.packagesPath, packageName)
              : undefined,
          options,
        };

        console.log(
          `Work context created for package: ${packageName}`,
          workContext
        );

        const result = await workOrchestrator.executeWork(workContext);
        results.push(result);

        if (!result.success) {
          this.handleError(`Failed to process package: ${packageName}`, result);
        }
      }

      // Combine all results to determine overall success
      const combinedResult = Result.combine(results);

      if (combinedResult.isSuccess) {
        console.log("\nWork execution completed successfully");
      } else {
        console.warn("\nWork execution completed with errors");
      }
    } catch (error) {
      this.handleError("Application error occurred", [
        error instanceof Error ? error.message : String(error),
      ]);
      process.exit(1);
    }
  }

  private logCommandLineArguments(args: ApplicationArgs): void {
    console.log("\tCommand:", args.command);
    console.log("\tOptions:", args.options);
    console.log("\tPositional arguments:", args.positionals);
  }

  /**
   * Handle errors from various sources
   * @param message Primary error message context
   * @param errorSource Result object or string array containing error details
   */
  private handleError(
    message: string,
    errorSource: Result<any> | string[] | undefined
  ): void {
    console.error(`${message}:`);

    let errors: string[] = [];

    // Handle different error source types
    if (errorSource) {
      if (Array.isArray(errorSource)) {
        errors = errorSource;
      } else if (
        typeof errorSource === "object" &&
        "errors" in errorSource &&
        Array.isArray(errorSource.errors)
      ) {
        errors = errorSource.errors;
      }
    }

    if (errors.length > 0) {
      errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
      });
    } else {
      console.error("  No additional error details available");
    }
  }
}
