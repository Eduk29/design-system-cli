const { exec } = require('child_process');

const executeComponentInstall = (componentName, npmInstallURL) => {
  let componentsNameList = [];
  listComponentsAvalailable().then(componentsList => {
    componentsList.forEach(component => {
      componentsNameList.push(component.name);
    });

    if (componentsList.includes(componentName)) {
      executeNPMInstall(componentName, npmInstallURL);
    } else {
      console.error(`Component ${componentName} not found in repository`);
      process.exit(1);
    }
  });
};

const executeNPMInstall = (componentName, npmInstallURL) => {
  exec(`npm install ${npmInstallURL}`, (error, stdout, stderr) => {
    console.log('Dependencies installed');

    if (error) {
      console.error(`Error during component ${componentName} install: ${error}`);
      process.exit(1);
    }
    console.log(stdout);
    console.log(stderr);
  });
};

const getFolderURLFromGithub = componentName => {
  const folderURL = `https://gitpkg.vercel.app/Eduk29/poc-design-system-angular-core/dist/${componentName}?develop`;
  return folderURL;
};

const installComponent = componentName => {
  console.log(`Installing component ${componentName}`);
  const npmInstallURL = getFolderURLFromGithub(componentName);
  executeComponentInstall(componentName, npmInstallURL);
};

const listComponentsAvalailable = async () => {
  const githubContentsURL = 'https://api.github.com/repos/Eduk29/poc-design-system-angular-core/contents/dist?ref=develop';
  const response = await fetch(githubContentsURL);

  if (!response.ok) {
    console.error('Error fetching components list');
    process.exit(1);
  }

  const componentsList = await response.json();

  return componentsList;
};

module.exports = { installComponent: installComponent };
