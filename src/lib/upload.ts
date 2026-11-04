import {writeFile, unlink, mkdir} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import { Dir } from 'node:fs';

const DIR = path.resolve('public/uploads');
const MAX = 2 * 1024 * 1024; // 2MB
const TYPES : Record<string, string> = {'image/jpeg' : '.jpeg', 'image/png' : '.png', 'image/webp' : '.webp'};

//error atau string kososng
export function checkImage(file: File): string{
    if (!TYPES[file.type]) return 'Gambar harus berformat JPG, PNG, atau WebP';
    if (file.size > MAX) return 'Ukuran gambar tidak boleh melebihi 2MB';
    return '';
}

export async function saveImage(file: File): Promise<string> {
    await mkdir(DIR, {recursive: true});
    const name = randomUUID() + TYPES[file.type];
    await writeFile(path.join(DIR, name), Buffer.from(await file.arrayBuffer()));
    return '/uploads/' + name;
}

export async function deleteImage(p?:string | null){
    if(!p) return;
    await unlink(path.join(DIR, path.basename(p))).catch(()=>{});
}
