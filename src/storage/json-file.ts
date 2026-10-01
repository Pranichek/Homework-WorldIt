import { readFile, writeFile } from "node:fs/promises";

export async function readJsonFile<T>(filePath: string): Promise<T[]>{
    const content: string = await readFile(filePath, "utf-8")
    const data: T[] = JSON.parse(content)
    return data
}


export async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void>{
    const content: string = JSON.stringify(data, null, 4)
    await writeFile(filePath, content, "utf-8")
}