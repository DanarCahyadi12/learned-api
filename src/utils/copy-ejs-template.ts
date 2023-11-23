import * as path from 'path';
import * as ncp from 'ncp';
export const copyEjsTemplate = () => {
  const sourcePath = path.join(
    __dirname,
    '..',
    '..',
    'src',
    'mail',
    'templates',
  );
  const destinationPath = path.join(__dirname, '..', 'mail', 'templates');
  ncp.ncp(sourcePath, destinationPath, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Templates copied successfully!');
  });
};
