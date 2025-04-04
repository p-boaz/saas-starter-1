/**
 * Test script for stolen-bases module after type migration
 *
 * Runs tests on various functions in the stolen-bases module
 * and outputs detailed results to logs/stolen-bases-test.log
 */

import * as fs from "fs";
import * as path from "path";
import {
  calculateStolenBaseProbability,
  getCareerStolenBaseProfile,
  getCatcherStolenBaseDefense,
  getPitcherRunningGameControl,
  getPlayerSeasonStats,
} from "../../lib/mlb/dfs-analysis/batters/stolen-bases";

// Logger setup
const LOG_FILE_PATH = path.join(__dirname, "../../logs/stolen-bases-test.log");

// Create logs directory if it doesn't exist
if (!fs.existsSync(path.dirname(LOG_FILE_PATH))) {
  fs.mkdirSync(path.dirname(LOG_FILE_PATH), { recursive: true });
}

// Initialize log file with timestamp
const initLogMessage = `
====================================
Stolen Bases Test Results
Run Date: ${new Date().toISOString()}
====================================

`;

fs.writeFileSync(LOG_FILE_PATH, initLogMessage);

// Logger function for both console and file
function log(message: string): void {
  console.log(message);
  fs.appendFileSync(LOG_FILE_PATH, message + "\n");
}

// Test result type
interface TestResult<T> {
  name: string;
  success: boolean;
  data: T | null;
  error?: Error;
  duration: number;
}

// Test function that returns detailed results
async function testFunction<T>(
  name: string,
  fn: () => Promise<T | null>
): Promise<TestResult<T>> {
  log(`Testing ${name}...`);
  const startTime = Date.now();
  let success = false;
  let error: Error | undefined;
  let data: T | null = null;

  try {
    data = await fn();
    success = data !== null;

    if (success) {
      log(`✅ ${name}: Success`);
    } else {
      log(`❌ ${name}: Failed (null result)`);
    }
  } catch (e) {
    error = e as Error;
    log(`❌ Error in ${name}: ${error.message}`);
  }

  const duration = Date.now() - startTime;
  log(`Duration: ${duration}ms\n`);

  return {
    name,
    success,
    data,
    error,
    duration,
  };
}

async function runTests(): Promise<void> {
  const testResults: TestResult<any>[] = [];
  const testStartTime = Date.now();

  // Write report header
  log("=".repeat(80));
  log(`STOLEN BASES MODULE TEST REPORT - ${new Date().toISOString()}`);
  log("=".repeat(80));
  log("\n");

  // Test player season stats for Ronald Acuña Jr. (ID: 660670)
  testResults.push(
    await testFunction("getPlayerSeasonStats", () =>
      getPlayerSeasonStats(660670)
    )
  );

  // Test career stolen base profile for Ronald Acuña Jr.
  testResults.push(
    await testFunction("getCareerStolenBaseProfile", () =>
      getCareerStolenBaseProfile(660670)
    )
  );

  // Test catcher stolen base defense for J.T. Realmuto (ID: 592663)
  testResults.push(
    await testFunction("getCatcherStolenBaseDefense", () =>
      getCatcherStolenBaseDefense(592663)
    )
  );

  // Test pitcher running game control for Max Scherzer (ID: 453286)
  testResults.push(
    await testFunction("getPitcherRunningGameControl", () =>
      getPitcherRunningGameControl(453286)
    )
  );

  // Test stolen base probability calculation for Acuña vs Scherzer
  // Using a test game ID "717465" for a Braves vs Mets game
  testResults.push(
    await testFunction("calculateStolenBaseProbability", () =>
      calculateStolenBaseProbability(660670, "717465", 453286)
    )
  );

  // Generate summary report
  const testEndTime = Date.now();
  const totalDuration = testEndTime - testStartTime;
  const successCount = testResults.filter((r) => r.success).length;
  const failureCount = testResults.length - successCount;

  log("=".repeat(80));
  log("TEST SUMMARY");
  log("=".repeat(80));
  log(`Total Tests: ${testResults.length}`);
  log(`Successes: ${successCount}`);
  log(`Failures: ${failureCount}`);
  log(`Total Duration: ${totalDuration}ms`);
  log("\n");

  // Per-test result summary
  log("DETAILED RESULTS:");
  testResults.forEach((result) => {
    log(
      `${result.name}: ${result.success ? "SUCCESS" : "FAILURE"} (${
        result.duration
      }ms)`
    );

    // For successful tests, write the first 200 chars of the result data
    if (result.success && result.data) {
      log("Data sample:");
      log(JSON.stringify(result.data, null, 2).substring(0, 200) + "...\n");
    }

    // For failed tests, include the error
    if (!result.success && result.error) {
      log(`Error: ${result.error.message}`);
      if (result.error.stack) {
        log(result.error.stack);
      }
      log("");
    }
  });

  // Close log file
  log("Test run complete");

  // Output filepath to console
  console.log(`\nDetailed test report written to: ${LOG_FILE_PATH}`);

  // Ensure the process terminates
  setTimeout(() => {
    process.exit(0);
  }, 500);
}

// Run the tests
runTests().catch((error) => {
  console.error("Fatal error during test execution:", error);
  process.exit(1);
});
