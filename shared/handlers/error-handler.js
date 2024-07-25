const {
  ERROR_DURING_BUILD_MESSAGE,
  ERROR_COMPONENT_UNAVALIABLE_MESSAGE,
  ERROR_READING_FILES_MESSAGE,
  ERROR_COMPONENT_NOT_FOUND_MESSAGE,
  ERROR_FETCHING_COMPONENTS_LIST_MESSAGE,
} = require('../messages/messages');

const _displayConsoleError = error => {
  console.error(`${error}`);
  console.error('Stoping and exiting process...');
  process.exit(1);
};

const _componentNotFoundMessage = (componentName, componentPath) => {
  const message = ERROR_COMPONENT_NOT_FOUND_MESSAGE.replace('$1', componentName).replace('$2', componentPath);
  _displayConsoleError(message);
};

const _componentUnavaliableMessage = componentName => {
  const message = ERROR_COMPONENT_UNAVALIABLE_MESSAGE.replace('$1', componentName);
  _displayConsoleError(message);
};

const _errorMessage = (componentName, cliMode, error) => {
  const message = ERROR_DURING_BUILD_MESSAGE.replace('$1', cliMode).replace('$2', componentName).replace('$3', error);
  _displayConsoleError(message);
};

const _fetchingComponentsListErrorMessage = () => {
  const message = ERROR_FETCHING_COMPONENTS_LIST_MESSAGE;
  _displayConsoleError(message);
};

const _readingFileErrorMessage = (error, componentPath) => {
  const message = ERROR_READING_FILES_MESSAGE.replace('$1', componentPath).replace('$2', error);
  _displayConsoleError(message);
};

const dispatchBuildOrInstallComponentError = (componentName, cliMode, error) => {
  _errorMessage(componentName, cliMode, error);
};

const dispatchComponentNotFound = (componentName, componentPath) => {
  _componentNotFoundMessage(componentName, componentPath);
};

const dispatchComponentUnavailableError = componentName => {
  _componentUnavaliableMessage(componentName);
};

const dispatchFetchingComponentsListError = () => {
  _fetchingComponentsListErrorMessage();
};

const dispatchFileReadingError = (error, componentPath) => {
  _readingFileErrorMessage(error, componentPath);
};

module.exports = {
  dispatchBuildOrInstallComponentError: dispatchBuildOrInstallComponentError,
  dispatchComponentNotFound: dispatchComponentNotFound,
  dispatchComponentUnavailableError: dispatchComponentUnavailableError,
  dispatchFetchingComponentsListError: dispatchFetchingComponentsListError,
  dispatchFileReadingError: dispatchFileReadingError,
};
