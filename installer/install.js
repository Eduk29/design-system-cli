const { exec } = require('child_process');
const { dispatchDependenciesInstalledMessage, dispatchInitiateBuildProcessMessage } = require('../shared/handlers/message-handler');
const { listComponentsAvalailable } = require('../api/github-service');
const { getFolderURLFromGithub } = require('../shared/utils/service-utils');
const { dispatchComponentUnavailableError, dispatchBuildOrInstallComponentError } = require('../shared/handlers/error-handler');

const executeComponentInstall = async (componentName, npmInstallURL) => {
  let componentsNameList = [];
  await listComponentsAvalailable().then(componentsList => {
    componentsList.forEach(component => {
      componentsNameList.push(component.name);
    });

    if (componentsNameList.includes(componentName)) {
      executeNPMInstall(componentName, npmInstallURL);
    } else {
      dispatchComponentUnavailableError(componentName);
    }
  });
};

const executeNPMInstall = (componentName, npmInstallURL) => {
  exec(`npm install ${npmInstallURL}`, error => {
    dispatchDependenciesInstalledMessage();

    if (error) {
      dispatchBuildOrInstallComponentError(componentName, 'install', error);
    }
  });
};

const installComponent = componentName => {
  dispatchInitiateBuildProcessMessage('Install', componentName);
  const npmInstallURL = getFolderURLFromGithub(componentName);
  executeComponentInstall(componentName, npmInstallURL);
};

module.exports = { installComponent: installComponent };
