const {
  AVAILABLE_COMPONENTS_LIST_URL,
  GITHUB_BRANCH,
  GITHUB_DOWNLOAD_DIST_URL,
  GITHUB_FOLDER,
  GITHUB_REPOSITORY,
  GITHUB_USERNAME,
} = require('../../api/env/env');

const getComponentsFromGithubURL = () => {
  const githubContentsURL = AVAILABLE_COMPONENTS_LIST_URL.replace('$1', GITHUB_USERNAME)
    .replace('$2', GITHUB_REPOSITORY)
    .replace('$3', GITHUB_FOLDER)
    .replace('$4', GITHUB_BRANCH);
  return githubContentsURL;
};

const getFolderURLFromGithub = componentName => {
  const folderURL = GITHUB_DOWNLOAD_DIST_URL.replace('$1', GITHUB_USERNAME)
    .replace('$2', GITHUB_REPOSITORY)
    .replace('$3', GITHUB_FOLDER)
    .replace('$4', componentName)
    .replace('$5', GITHUB_BRANCH);
  return folderURL;
};

module.exports = { getComponentsFromGithubURL: getComponentsFromGithubURL, getFolderURLFromGithub: getFolderURLFromGithub };
