const { dispatchFetchingComponentsListError } = require('../shared/handlers/error-handler');
const { getComponentsFromGithubURL, getAllModulesFromGithubURL } = require('../shared/utils/service-utils');

const listComponentsAvalailable = async () => {
  const githubContentsURL = getComponentsFromGithubURL();
  const response = await fetch(githubContentsURL);
  const componentsList = await response.json();

  return !response.ok ? dispatchFetchingComponentsListError() : componentsList;
};

const listModulesAvalailable = async () => {
  const githubContentsURL = getAllModulesFromGithubURL();
  const response = await fetch(githubContentsURL);
  const availableModuleList = await response.json();

  return !response.ok ? dispatchFetchingComponentsListError() : availableModuleList;
};

module.exports = { listComponentsAvalailable: listComponentsAvalailable, listModulesAvalailable: listModulesAvalailable };
