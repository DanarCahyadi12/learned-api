import * as path from 'path';
import * as ncp from 'ncp';
export const copyStorages = () => {
  const sourcePath = path.join(__dirname, '..', '..', 'storages');
  const destinationPath = path.join(__dirname, '..', 'storages');
  ncp.ncp(sourcePath, destinationPath, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Storage copied successfully!');
  });
};
