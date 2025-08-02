export class Reporter {
  static report(message: string): void {
    console.log(`[REPORTER] ${message}`);
  }

  async outputMain(): Promise<void> {
    return;
  }
}
