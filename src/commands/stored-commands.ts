import { versions } from "./versions.js";

const storedCommands = {
    'versions': (args: string[]) => versions(args),
    'install': (args: string[]) => "todo"
};

export { storedCommands }