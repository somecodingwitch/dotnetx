import chalk from 'chalk';
import { quickRunShellCommand } from '../command-line/quick-run-command.js';

async function versions(flags: string[]) {
    if (flags.includes('--list-not-installed-sdks')) {
        const notInstalledSdks = await _notInstalledSdks();
        console.log(`- ${chalk.bold.cyan('Currently not installed .NET SDK versions')}`);
        console.log('');
        console.log(notInstalledSdks.join('\n'));
        return;
    }

    const result = {
        runtimes: [] as string[],
        sdks: [] as string[]
    };

    const listPathes = flags.includes('--list-pathes');
    const listRuntimes = flags.includes('--list-runtimes');

    console.log(`- ${chalk.bold.cyan('Currently installed .NET versions')}`);
    console.log('');

    const internalVersions = await _versions(listPathes, listRuntimes);

    result.runtimes = internalVersions
        .filter(item => item.type === 'runtime')
        .map(item => `- ${item.name} ${item.version} ${item.path}`);

    result.sdks = internalVersions
        .filter(item => item.type === 'SDK')
        .map(item => `- SDK ${item.version} ${item.path}`);

    if (result.sdks.length) {
        console.log(result.sdks.join('\n'));
    }

    if (result.runtimes.length) {
        console.log(result.runtimes.join('\n'));
    }
}

async function _versions(listPathes: boolean, listRuntimes: boolean) {
    const result = [] as Array<{
        type: 'runtime' | 'SDK',
        name: string,
        version: string,
        path: string
    }>

    const sdksData = quickRunShellCommand('dotnet --list-sdks');
    if (sdksData.stderr) {
        throw new Error(sdksData.stderr);
    }

    const lines = sdksData.stdout.split('\n');

    for (const line of lines) {
        if (line) {
            const items = line.split(' ');
            const sdkVersion = items[0];
            const sdkPath = listPathes ? [items[1], items[2]].join('') : '';  
            result.push({
                type: 'SDK',
                name: '.NET',
                version: sdkVersion,
                path: sdkPath
            });
        }
    }

    if (listRuntimes) {
        const runtimesData = quickRunShellCommand('dotnet --list-runtimes');
        
        if (runtimesData.stderr) {
            throw new Error(runtimesData.stderr);
        }

        const lines = runtimesData.stdout.split('\n');

        for (const line of lines) {
            if (line) {
                const items = line.split(' ');
                const runtimeName = items[0];
                const runtimeVersion = items[1];
                const runtimePath = listPathes ? [items[2], items[3]].join('') : '';

                result.push({
                    type: 'runtime',
                    name: runtimeName,
                    version: runtimeVersion,
                    path: runtimePath
                });
            }
        }
    }

    return result;
}

async function _notInstalledSdks() {
    const apiUrl = "https://raw.githubusercontent.com/dotnet/core/main/release-notes/releases-index.json";
    const result = await fetch(apiUrl).then(r => r.json());

    const allSdkVersions = result['releases-index']
        .map((item: any) => item['latest-release']) as string[];

    const installedSdkVersions = (await _versions(false, false)).filter(x => x.type === 'SDK').map(x => x.name);

    return allSdkVersions.filter(version => !installedSdkVersions.includes(version)).sort((a, b) => Number(b[0]) - Number(a[0]));
}

export { versions }