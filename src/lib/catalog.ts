import db from './database'

export interface Catalog {
    id : number;
    image_path : string | null;
    name : string;
    description : string | null;
    link : string;
    created_at : string;
}

export interface CatalogInput {
    name : string;
    description : string | null;
    link : string;
    image_path : string | null;
}

export type Errors = Partial<Record<'name' | 'description' | 'link' | 'image', string>>;

const where = `WHERE name LIKE @like OR description LIKE @like OR link LIKE @like`;

export function searchCatalogs(q = '', limit = -1, offset = 0): Catalog[] {
    return db
    .prepare(`SELECT * FROM catalogs ${where} ORDER BY created_at DESC LIMIT @limit OFFSET @offset`)
    
    .all({ like: `%${q}%`, limit, offset }) as Catalog[];
}

export function countCatalogs(q = ''): number {
    const row = db.prepare(`SELECT COUNT(*) AS n FROM catalogs ${where}`).get({ like: `%${q}%` }) as {n : number};
    return row.n;
}

export function getCatalog(id: number){
    return db.prepare(`SELECT * FROM catalogs WHERE id = ?`).get(id) as Catalog | undefined;
}

export function insertCatalog(d: CatalogInput){
    db.prepare(`INSERT INTO catalogs (image_path, name, description, link) VALUES (?, ?, ?, ?)`).run(d.image_path, d.name, d.description, d.link);
}

export function updateCatalog(id: number, d: CatalogInput){
    db.prepare(`UPDATE catalogs SET image_path = ?, name = ?, description = ?, link = ? WHERE id = ?`).run(d.image_path, d.name, d.description, d.link, id);
}

export function deleteCatalog(id: number){
    db.prepare(`DELETE FROM catalogs WHERE id = ?`).run(id);
}

export function readForm(f: FormData) {
  const image = f.get('image');
  return {
    name: String(f.get('name') ?? '').trim(),
    description: String(f.get('description') ?? '').trim(),
    link: String(f.get('link') ?? '').trim(),
    image: image instanceof File && image.size > 0 ? image : null,
  };
}

export function validate(v: { name: string; description: string; link: string }): Errors {
  const e: Errors = {};

  if (!v.name) e.name = 'Nama katalog wajib diisi';
  else if (v.name.length > 100) e.name = 'Nama maksimal 100 karakter';
  
  if (v.description.length > 500) e.description = 'Deskripsi maksimal 500 karakter';
  try {
    const u = new URL(v.link);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new Error();
  } 
  catch {
    e.link = 'Link harus diawali https:// — contoh: https://vault.dst-group.co.id';
  }
  return e;
}