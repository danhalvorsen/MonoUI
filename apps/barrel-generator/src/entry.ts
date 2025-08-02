import { ApplicationBootstrap } from "./ApplicationBootstrap.js";
import { FileConfigProvider } from "./input/ConfigurationFile/FileConfigProvider.js";
import { StandardCommandLineParser } from "./input/CommandLine/StandardCommandLineParser.js";
import { BarrelConfiguration } from "./models/BarrelConfiguration.js";

/**
 * Application entry point with proper separation of concerns
 */
async function bootstrap(): Promise<void> {
  try {
    // Create dependencies (could be moved to a DI container)
    const configProvider = new FileConfigProvider("c:\\appl\\configuration.json");
    const commandLineParser = new StandardCommandLineParser(process.argv.slice(2));

    // Create and start the application
    const app = new ApplicationBootstrap(configProvider, commandLineParser);
    await app.start<BarrelConfiguration>();
  } catch (error) {
    console.error("Unhandled bootstrap error:", error);
    process.exit(1);
  }
}

// Execute the bootstrap function
bootstrap().catch((error) => {
  console.error("Critical error:", error);
  process.exit(1);
});