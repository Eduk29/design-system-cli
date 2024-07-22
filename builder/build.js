const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { glob } = require('glob');
const { existComponentInPath, revertUpdateImportsInTSFile, updateImportsInTSFile } = require('./utils');

function buildComponent(componentName) {
  const componentPath = `${getComponentPath(componentName)}/ng-package.json`;
  console.log(`Building component ${componentName}...`);
  existComponentInPath(componentName, componentPath);
  executeComponentBuild(componentName, componentPath);
}

function getComponentPath(componentName) {
  return path.resolve(process.cwd(), `./src/app/components/${componentName}`);
}

function copySharedToComponentPath(componentName) {
  const sharedPath = path.resolve(process.cwd(), './src/app/shared');
  const componentSharedPath = path.resolve(process.cwd(), `./src/app/components/${componentName}/shared`);

  console.log(`Copying shared folder to component ${componentName}...`);

  if (!fs.existsSync(componentSharedPath)) {
    fs.mkdirSync(componentSharedPath);
  }

  fs.copySync(sharedPath, componentSharedPath);
}

function searchTSFilesInComponent(componentName, componentPath, revertTSFile) {
  const rawComponentPath = componentPath.replace('/ng-package.json', '');

  glob(`${rawComponentPath}/*.ts`)
    .then(files => {
      if (!revertTSFile) {
        console.log(`Searching files in component ${componentName}...`);
        console.log(`Updating imports in ${rawComponentPath}...`);
      } else {
        console.log(`Revert files in component ${componentName}...`);
        console.log(`Reverting imports in ${rawComponentPath}...`);
        console.log('');
      }
      files.forEach((file, index) => {
        if (!revertTSFile) {
          updateImportsInTSFile(file);
          return;
        } else {
          revertUpdateImportsInTSFile(file);
          if (index === files.length - 1) {
            console.log(`Imports in component ${componentName} reverted successfully`);
            console.log(`Removing shared folder from component ${componentName}...`);
            fs.removeSync(`${rawComponentPath}/shared`);
            console.log('');
            console.log(`Congratulations!! Component ${componentName} built successfully`);
          }
          return;
        }
      });
    })
    .catch(error => {
      if (error) {
        console.error(`Error reading files in ${componentPath}: ${error}`);
        return error;
      }
    });
}

function executeComponentBuild(componentName, componentPath) {
  copySharedToComponentPath(componentName);
  searchTSFilesInComponent(componentName, componentPath);
  console.log('Installing dependencies...');
  exec(`npx ng-packagr -p ${componentPath}`, (error, stdout, stderr) => {
    console.log('Dependencies installed');

    if (error) {
      console.error(`Error during component ${componentName} construction: ${error}`);
      process.exit(1);
    }
    searchTSFilesInComponent(componentName, componentPath, true);
    console.log(stdout);
    console.log(stderr);
  });
}

module.exports = { buildComponent: buildComponent };
