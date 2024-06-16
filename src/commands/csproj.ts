import { readFile } from "fs/promises";
import { toJson } from 'xml2json'
async function csproj(flags: string[]) {

}

async function _getCsprojData(path: string) {
    const xmlContent = (await readFile(path)).toString();
    const jsonContent = JSON.parse(toJson(xmlContent));
}