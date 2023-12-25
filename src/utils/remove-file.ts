import * as fs from 'fs';
export function removeFile(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rm(dir, (err) => {
      if (err) throw err;
      const dirFolder: string = dir
        .split('\\')
        .splice(0, dir.split('\\').length - 1)
        .join('\\');
      fs.rmdir(dirFolder, (err) => {
        if (err) throw err;
      });
    });
  }
}
