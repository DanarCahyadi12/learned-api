import { copyEjsTemplate } from './copy-ejs-template';
import { copyPublicFolder } from './copy-public-folder';
import { copyStorages } from './copy-storages';
export const copyIntoDistFolder = () => {
  copyEjsTemplate();
  copyPublicFolder();
  copyStorages();
};
