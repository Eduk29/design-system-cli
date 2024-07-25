const fs = require('fs-extra');
const { dispatchComponentNotFound } = require('../handlers/error-handler');

const existComponentInPath = (componentName, componentPath) => {
  if (!fs.existsSync(componentPath)) {
    dispatchComponentNotFound(componentName, componentPath);
    return false;
  }
  return true;
};

const revertUpdateImportsInTSFile = file => {
  const fileContent = fs.readFileSync(file, 'utf8');
  const newFileContent = fileContent.replace(/from '.\/shared\//g, "from '@design-system/shared/");

  fs.writeFileSync(file, newFileContent, 'utf8');
};

const showLoading = message => {
  const loadingCharacters = ['|', '/', '-', '\\'];
  let index = 0;

  return setInterval(() => {
    process.stdout.write(`\r ${message} ${loadingCharacters[index]}`);
    index = (index + 1) % loadingCharacters.length;
  }, 100);
};

const stopLoading = interval => {
  clearInterval(interval);
  process.stdout.write('\n');
};

const updateImportsInTSFile = file => {
  const fileContent = fs.readFileSync(file, 'utf8');

  const newFileContent = fileContent.replace(/from '@design-system\/shared/g, `from './shared`);

  fs.writeFileSync(file, newFileContent, 'utf8');
};

module.exports = {
  existComponentInPath: existComponentInPath,
  revertUpdateImportsInTSFile: revertUpdateImportsInTSFile,
  showLoading: showLoading,
  stopLoading: stopLoading,
  updateImportsInTSFile: updateImportsInTSFile,
};
