import * as path from 'path';
import * as ncp from 'ncp';
export const copyPublicFolder = () => {
  const sourcePath = path.join(__dirname, '..', 'public');
  const destinationPath = path.join(__dirname, 'public');
  ncp.ncp(sourcePath, destinationPath, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Public copied successfully!');
  });
};
