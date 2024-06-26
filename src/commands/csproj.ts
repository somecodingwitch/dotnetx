import chalk from "chalk";
import { readFile } from "fs/promises";
import { toJson } from 'xml2json'
import { basename } from "path";

async function csproj(args: string[]) {
    const csprojPath = args[args.indexOf('--path') + 1];
    const data = await _getCsprojData(csprojPath);
    
    if (args.includes('--info')) {
        console.log(
            chalk.bold('Project information - ') +
            chalk.bold.cyan(basename(csprojPath))
        );
        console.log('');
        data.attributes.name !== undefined && console.log(
            'Name: ' +
            chalk.yellow(data.attributes.name)
        );
        data.attributes.version !== undefined && console.log(
            'Version: ' +
            chalk.yellow(data.attributes.version)
        );
        data.attributes.product !== undefined && console.log(
            'Product: ' +
            chalk.yellow(data.attributes.product)
        );
        data.attributes.company !== undefined && console.log(
            'Company: ' +
            chalk.yellow(data.attributes.company)
        );
        data.attributes.authors !== undefined && console.log(
            'Authors: ' +
            chalk.yellow(data.attributes.authors)
        );
        data.compilation.targetFramework !== undefined && console.log(
            'Target Framework: ' +
            chalk.yellow(data.compilation.targetFramework)
        );
        data.compilation.runtimeIdentifiers !== undefined && console.log(
            'Runtime Identifiers: ' +
            chalk.yellow(data.compilation.runtimeIdentifiers)
        );
        data.compilation.packageVersion !== undefined && console.log(
            'Package Version: ' +
            chalk.yellow(data.compilation.packageVersion)
        );
        data.compilation.preserveCompilationContext !== undefined && console.log(
            'Preserve Compilation Context? ' +
            chalk.green(data.compilation.preserveCompilationContext)
        );
        data.compilation.generatePackageOnBuild !== undefined && console.log(
            'Generate Package on Build? ' +
            chalk.green(data.compilation.generatePackageOnBuild)
        );
        console.log('');
    }

    if (args.includes('--all-dependencies')) {
        console.log(
            chalk.bold('References - ') +
            chalk.bold.cyan(basename(csprojPath))
        );
        data.references.forEach((reference: any) => {
            console.log(
                reference.name 
                + chalk.yellow(' > ') 
                + chalk.green(reference.version)
            );
        });
        console.log('');
    } 
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

    const packageReference = itemGroup.PackageReference;

    const references = packageReference.map((reference: any) => ({
        name: reference.Include,
        version: reference.Version
    }));

    return {
        attributes,
        compilation,
        references
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