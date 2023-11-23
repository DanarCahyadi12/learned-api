import { copyEjsTemplate } from './copy-ejs-template';
import { copyPublicFolder } from './copy-public-folder';
export const copyIntoDistFolder = () => {
  copyEjsTemplate();
  copyPublicFolder();
};
