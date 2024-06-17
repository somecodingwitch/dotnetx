import { checkForDotnet } from "../command-line/check-for-dotnet.js";
import { csproj } from "./csproj.js";
import { versions } from "./versions.js";

const storedCommands = {
    'status': () => console.log(checkForDotnet(false)),
    'versions': (args: string[]) => versions(args),
    'install': (args: string[]) => "todo",
    'csproj': (args: string[]) => csproj(args)
};

export { storedCommands }