import { readFile } from "fs/promises";
import { toJson } from 'xml2json'

async function csproj(args: string[]) {
    const path = args[args.indexOf('--path') + 1];
    const data = await _getCsprojData(path);
    console.log(data)
}

async function _getCsprojData(path: string) {
    const xmlContent = (await readFile(path)).toString();
    const jsonContent = JSON.parse(toJson(xmlContent)).Project;
    
    const propertyGroup = _flatAndDecapitalizeObjects(jsonContent.PropertyGroup)
    const itemGroup = _flatAndDecapitalizeObjects(jsonContent.ItemGroup);

    const metadata = propertyGroup;
    const references = _flatPackageReferences(itemGroup.packageReference);
    
    return {
        metadata,
        references
    }
}

function _flatAndDecapitalizeObjects(obj: any[]) {
    const flat = obj.reduce((acc, cur) => ({ ...cur, ...acc }));
    const x = {} as any;

    for (const [key, value] of Object.entries(flat)) {
        const newKey = key[0].toLowerCase() + key.slice(1);
        x[newKey] = value;
    }

    return x;
}

function _flatPackageReferences(obj: any[]) {
    return obj.reduce((acc, curr) => {
        return { [curr.Include]: curr.Version, ...acc }
    });
}


export { csproj }