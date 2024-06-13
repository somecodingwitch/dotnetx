import { quickRunShellCommand } from "./quick-run-command.js";
import chalk from 'chalk';

function checkForDotnet(exitOnError = true) {
    const result = quickRunShellCommand('dotnet');

    if (result.stderr) {
        const messagePrefix = chalk.redBright.bold('.NET not found')
        console.log(messagePrefix + ' The dotnet command was not found in your system.');
        return exitOnError ? process.exit(1) : 0;
    }

    return 1;
}

export { checkForDotnet }