const { dispatchFetchingComponentsListError } = require('../shared/handlers/error-handler');
const { getComponentsFromGithubURL } = require('../shared/utils/service-utils');

const listComponentsAvalailable = async () => {
  const githubContentsURL = getComponentsFromGithubURL();
  const response = await fetch(githubContentsURL);

  if (!response.ok) {
    dispatchFetchingComponentsListError();
  }

  const componentsList = await response.json();

  return componentsList;
};

module.exports = { listComponentsAvalailable: listComponentsAvalailable };
