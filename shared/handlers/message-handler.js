const fs = require('fs-extra');
const {
  LOG_COPY_FOLDER_MESSAGE,
  LOG_INITIATE_PROCESS_MESSAGE,
  LOG_DEPENCECIES_INSTALLING,
  LOG_REVERT_IMPORTS_MESSAGE,
  LOG_REVERTING_IMPORTS_MESSAGE,
  EMPTY_MESSAGE,
  LOG_REVERTED_IMPORTS_SUCCESSFULLY_MESSAGE,
  LOG_REMOVING_SHARED_FOLDER_MESSAGE,
  LOG_BUILD_SUCCESSFULLY_MESSAGE,
  LOG_SEARCHING_FILES_MESSAGE,
  LOG_UPDATING_IMPORTS_MESSAGE,
  LOG_DEPENCECIES_INSTALLED,
} = require('../messages/messages');

const _displayConsoleLog = message => {
  console.log(`${message}`);
};

const _copyingFolderMessage = (componentName, folder) => {
  const message = LOG_COPY_FOLDER_MESSAGE.replace('$1', folder).replace('$2', componentName);
  _displayConsoleLog(message);
};

const _dependenciesInstalledMessage = () => {
  const message = LOG_DEPENCECIES_INSTALLED;
  _displayConsoleLog(message);
};

function _initiateBuildProcessMessage(cliMode, componentName) {
  const message = LOG_INITIATE_PROCESS_MESSAGE.replace('$1', cliMode).replace('$2', componentName);
  _displayConsoleLog(message);
}

const _initiateInstallingDependenciesMessage = () => {
  const message = LOG_DEPENCECIES_INSTALLING;
  _displayConsoleLog(message);
};

const _revertImportsMessage = (componentName, componentPath) => {
  const messageRevertImports = LOG_REVERT_IMPORTS_MESSAGE.replace('$1', componentName);
  const messageRevertingImports = LOG_REVERTING_IMPORTS_MESSAGE.replace('$1', componentPath);
  _displayConsoleLog(messageRevertImports);
  _displayConsoleLog(messageRevertingImports);
  _displayConsoleLog(EMPTY_MESSAGE);
};

const _successfullRevertMessage = (actualPosition, totalCount, componentName, componentPath) => {
  if (actualPosition === totalCount - 1) {
    const messageSuccessfullyReveted = LOG_REVERTED_IMPORTS_SUCCESSFULLY_MESSAGE.replace('$1', componentName);
    const messageRemovingSharedFolder = LOG_REMOVING_SHARED_FOLDER_MESSAGE.replace('$1', componentPath);
    const messageBuildSuccessfully = LOG_BUILD_SUCCESSFULLY_MESSAGE.replace('$1', componentName);
    _displayConsoleLog(messageSuccessfullyReveted);
    _displayConsoleLog(messageRemovingSharedFolder);
    fs.removeSync(`${componentPath}/shared`);
    _displayConsoleLog(EMPTY_MESSAGE);
    _displayConsoleLog(messageBuildSuccessfully);
  }
};

const _updateImportsMessage = (componentName, rawComponentPath) => {
  const messageSearchingFiles = LOG_SEARCHING_FILES_MESSAGE.replace('$1', componentName);
  const messageUpdatingImports = LOG_UPDATING_IMPORTS_MESSAGE.replace('$1', rawComponentPath);
  _displayConsoleLog(messageSearchingFiles);
  _displayConsoleLog(messageUpdatingImports);
};

const dispatchCopyingFolderMessage = (componentName, folder) => {
  _copyingFolderMessage(componentName, folder);
};

const dispatchDependenciesInstalledMessage = () => {
  _dependenciesInstalledMessage();
};

const dispatchInitiateBuildProcessMessage = (cliMode, componentName) => {
  _initiateBuildProcessMessage(cliMode, componentName);
};

const dispatchInitiateInstallingDependenciesMessage = () => {
  _initiateInstallingDependenciesMessage();
};

const dispatchRevertImportsMessage = (componentName, componentPath) => {
  _revertImportsMessage(componentName, componentPath);
};

const dispatchSuccessfullRevertMessage = (actualPosition, totalCount, componentName, componentPath) => {
  _successfullRevertMessage(actualPosition, totalCount, componentName, componentPath);
};

const dispatchUpdateImportsMessage = (componentName, rawComponentPath) => {
  _updateImportsMessage(componentName, rawComponentPath);
};

module.exports = {
  dispatchCopyingFolderMessage: dispatchCopyingFolderMessage,
  dispatchDependenciesInstalledMessage: dispatchDependenciesInstalledMessage,
  dispatchInitiateBuildProcessMessage: dispatchInitiateBuildProcessMessage,
  dispatchInitiateInstallingDependenciesMessage: dispatchInitiateInstallingDependenciesMessage,
  dispatchRevertImportsMessage: dispatchRevertImportsMessage,
  dispatchSuccessfullRevertMessage: dispatchSuccessfullRevertMessage,
  dispatchUpdateImportsMessage: dispatchUpdateImportsMessage,
};
