import { checkForDotnet } from "../command-line/check-for-dotnet.js";
import { versions } from "./versions.js";

const storedCommands = {
    'status': () => console.log(checkForDotnet(false)),
    'versions': (args: string[]) => versions(args),
};

export { storedCommands }