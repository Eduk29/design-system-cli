const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { glob } = require('glob');
const { existComponentInPath, revertUpdateImportsInTSFile, updateImportsInTSFile } = require('../shared/utils/utils');
const {
  dispatchInitiateBuildProcessMessage,
  dispatchCopyingFolderMessage,
  dispatchUpdateImportsMessage,
  dispatchRevertImportsMessage,
  dispatchSuccessfullRevertMessage,
  dispatchInitiateInstallingDependenciesMessage,
  dispatchDependenciesInstalledMessage,
} = require('../shared/handlers/message-handler');
const { dispatchBuildOrInstallComponentError, dispatchFileReadingError } = require('../shared/handlers/error-handler');
const { angularSharedPath, angularComponentPath, packagrJsonName, angularBuildCommand } = require('../shared/utils/build-utils');

function buildComponent(componentName) {
  const componentPath = `${getComponentPath(componentName)}/${packagrJsonName}`;
  const existComponent = existComponentInPath(componentName, componentPath);
  dispatchInitiateBuildProcessMessage('Build', componentName);

  if (existComponent) {
    executeComponentBuild(componentName, componentPath);
  }
}

function getComponentPath(componentName) {
  const componentPath = angularComponentPath.replace('$1', componentName);
  return path.resolve(process.cwd(), componentPath);
}

function copySharedToComponentPath(componentName) {
  const sharedPath = path.resolve(process.cwd(), angularSharedPath);
  const componentPath = angularComponentPath.replace('$1', componentName);
  const componentSharedPath = path.resolve(process.cwd(), `${componentPath}/shared`);

  dispatchCopyingFolderMessage(componentName, 'shared');

  if (!fs.existsSync(componentSharedPath)) {
    fs.mkdirSync(componentSharedPath);
  }

  fs.copySync(sharedPath, componentSharedPath);
}

function searchTSFilesInComponent(componentName, componentPath, revertTSFile) {
  const rawComponentPath = componentPath.replace(`/${packagrJsonName}`, '');

  glob(`${rawComponentPath}/*.ts`)
    .then(files => {
      if (!revertTSFile) {
        dispatchUpdateImportsMessage(componentName, rawComponentPath);
      } else {
        dispatchRevertImportsMessage(componentName, rawComponentPath);
      }
      executeFileChange(files, revertTSFile, componentName, rawComponentPath);
    })
    .catch(error => {
      if (error) {
        dispatchFileReadingError(error, componentPath);
      }
    });
}

function executeFileChange(files, revertTSFile, componentName, rawComponentPath) {
  files.forEach((file, index) => {
    if (!revertTSFile) {
      updateImportsInTSFile(file);
      return;
    } else {
      revertUpdateImportsInTSFile(file);
      dispatchSuccessfullRevertMessage(index, files.length, componentName, rawComponentPath);
      return;
    }
  });
}

function executeComponentBuild(componentName, componentPath) {
  copySharedToComponentPath(componentName);
  searchTSFilesInComponent(componentName, componentPath);
  dispatchInitiateInstallingDependenciesMessage();
  exec(`${angularBuildCommand} ${componentPath}`, error => {
    dispatchDependenciesInstalledMessage();

    if (error) {
      dispatchBuildOrInstallComponentError(componentName, 'build', error);
    }
    searchTSFilesInComponent(componentName, componentPath, true);
  });
}

module.exports = { buildComponent: buildComponent };
