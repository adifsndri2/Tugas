import readme from '../../README.md?raw';

const firstParagraph = readme
  .split(/\r?\n\s*\r?\n/)
  .map((paragraph) => paragraph.trim())
  .find((paragraph) => paragraph && !paragraph.startsWith('#') && !paragraph.startsWith('```'));

export const projectDescription =
  firstParagraph ?? 'Portal katalog layanan internal DST.';
