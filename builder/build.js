const path = require('path');
const {
  dispatchInitiateBuildProcessMessage,
  dispatchInitiateInstallingDependenciesMessage,
  dispatchDependenciesInstalledMessage,
} = require('../shared/handlers/message-handler');
const { dispatchBuildOrInstallComponentError } = require('../shared/handlers/error-handler');
const { angularBuildCommand } = require('../shared/utils/build-utils');
const {
  constructComponentPath,
  copyExternalModuleToComponentFolder,
  copySharedFolderToComponentFolder,
  existComponentInPath,
  listModulesToUpdateTSFile,
  moduleContainsExternalModules,
  moduleUseSharedFolder,
  removeSharedFolderFromComponent,
  removeModulesFolderFromComponent,
  revertUpdateSharedImportsInTSFile,
  revertUpdateModulesImportsInTSFile,
  updateSharedImportsInTSFile,
  updateModulesImportsInTSFile,
} = require('../shared/utils/utils');
const { exec } = require('child_process');

const buildComponent = async componentName => {
  dispatchInitiateBuildProcessMessage('Build', componentName);
  const rawComponentPath = constructComponentPath(componentName);
  const componentPath = path.resolve(process.cwd(), rawComponentPath);
  const existComponent = existComponentInPath(componentName, componentPath);
  let componentUseShared = await _executeSharedFolderOperations(componentName, componentPath, existComponent);
  let componentHasExternalModules = await _executeExternalModuleOperations(componentName, componentPath, existComponent);

  if (existComponent && !componentHasExternalModules && !componentUseShared) {
    _executeComponentBuild(componentName, componentPath);
  }
};

const _executeComponentBuild = (componentName, componentPath) => {
  dispatchInitiateInstallingDependenciesMessage();
  exec(`${angularBuildCommand} ${componentPath}`, error => {
    dispatchDependenciesInstalledMessage();

    if (error) {
      dispatchBuildOrInstallComponentError(componentName, 'build', error);
    } else {
      revertUpdateSharedImportsInTSFile(componentPath);
      revertUpdateModulesImportsInTSFile(componentName, componentPath);
      removeModulesFolderFromComponent(componentName);
      removeSharedFolderFromComponent(componentName);
    }
  });
};

const _executeExternalModuleOperations = async (componentName, componentPath, existComponent) => {
  let componentHasExternalModules = await moduleContainsExternalModules(componentPath);

  if (existComponent && componentHasExternalModules) {
    const externalModulesCopied = copyExternalModuleToComponentFolder(componentName);
    const modulesToUpdateTSFile = await listModulesToUpdateTSFile(componentName);
    const externalImportsUpdated = updateModulesImportsInTSFile(componentPath, modulesToUpdateTSFile);
    componentHasExternalModules = externalModulesCopied && externalImportsUpdated;
  }
  return componentHasExternalModules;
};

const _executeSharedFolderOperations = async (componentName, componentPath, existComponent) => {
  let componentUseShared = await moduleUseSharedFolder(componentPath);

  if (existComponent && componentUseShared) {
    const sharedCopied = copySharedFolderToComponentFolder(componentName);
    const sharedImportsUpdated = updateSharedImportsInTSFile(componentPath);
    componentUseShared = sharedCopied && sharedImportsUpdated;
  }
  return componentUseShared;
};

module.exports = { buildComponent: buildComponent };
