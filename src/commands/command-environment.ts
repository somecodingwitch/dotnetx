import chalk from 'chalk';
import { checkForDotnet } from '../command-line/check-for-dotnet.js';
import { storedCommands } from './stored-commands.js';

class CommandEnvironment {
    private readonly curretDotnetxVersion = '0.1.1 alpha';

    start() {
        const version = chalk.cyan('v' + this.curretDotnetxVersion);
        const title = `dotnetx ${version}`;
        const processArgs = process.argv.slice(2);
        const currentCommand = process.argv.slice(2)[0] as keyof typeof storedCommands;

        if (!processArgs.length) {
            console.log(title);
            console.log('');
            //TODO: Show help
        }


        if (currentCommand !== 'install') {
            checkForDotnet();
        }
        
        storedCommands[currentCommand](processArgs);
    }
}

export { CommandEnvironment }