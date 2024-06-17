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
    
    const propertyGroup = _flatObjectArray(jsonContent.PropertyGroup)
    const itemGroup = _flatObjectArray(jsonContent.ItemGroup);

    const attributes = {
        name: propertyGroup.Name,
        version: propertyGroup.Version,
        product: propertyGroup.Product,
        company: propertyGroup.Company,
        authors: propertyGroup.Authors
    };

    const compilation = {
        targetFramework: propertyGroup.TargetFramework,
        runtimeIdentifiers: propertyGroup.RuntimeIdentifiers && propertyGroup.RuntimeIdentifiers.split(';'),
        packageVersion: propertyGroup.PackageVersion,
        preserveCompilationContext: _boolFromString(propertyGroup.PreserveCompilationContext),
        generatePackageOnBuild: _boolFromString(propertyGroup.GeneratePackageOnBuild)
    };

    return {
        attributes,
        compilation
    }
}

function _flatObjectArray(obj: any[]) {
    const flat = obj.reduce((acc, cur) => ({ ...cur, ...acc }));
    return flat;
}

function _boolFromString(stringBool: string) {
    return stringBool === 'true' ? true : false;
}

export { csproj }