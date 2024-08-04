const fs = require('fs-extra');
const path = require('path');
const { glob } = require('glob');
const { angularComponentPath, angularSharedPath } = require('./build-utils');
const { dispatchComponentNotFound } = require('../handlers/error-handler');
const { listModulesAvalailable } = require('../../api/github-service');

const constructComponentPath = componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  return componentPath;
};

const copyExternalModuleToComponentFolder = async componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  const completeComponentPath = path.resolve(process.cwd(), componentPath);
  const modulesToCopy = await listModulesToUpdateTSFile(componentName);

  modulesToCopy.map(module => {
    const moduleToCopyPath = `${completeComponentPath}\\${module}`;
    const externalModulePath = path.resolve(process.cwd(), `src\\app\\components\\${module}`);
    const copiedExternalModulePath = path.resolve(process.cwd(), `src\\app\\components\\${componentName}\\${module}`);

    if (!fs.existsSync(moduleToCopyPath) && fs.existsSync(moduleToCopyPath)) {
      fs.mkdirSync(moduleToCopyPath);
      fs.copySync(externalModulePath, moduleToCopyPath);
    }

    copySharedFolderToComponentFolder(componentName);
    updateModulesImportsInTSFile(copiedExternalModulePath, [module]);
    updateSharedImportsInTSFile(copiedExternalModulePath, '..');
    _removeFile(moduleToCopyPath);
    return true;
  });
  return false;
};

const copySharedFolderToComponentFolder = componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  const componentSharedPath = path.resolve(process.cwd(), `${componentPath}/shared`);
  const sharedPath = path.resolve(process.cwd(), angularSharedPath);

  if (!fs.existsSync(componentSharedPath) && fs.existsSync(sharedPath)) {
    fs.mkdirSync(componentSharedPath);
    fs.copySync(sharedPath, componentSharedPath);
    return true;
  }
  return false;
};

const existComponentInPath = (componentName, componentPath) => {
  if (!fs.existsSync(componentPath)) {
    dispatchComponentNotFound(componentName, componentPath);
    return false;
  }
  return true;
};

const listFilesInsidePath = path => {
  const files = fs.readdirSync(path);
  const tsFiles = files.filter(file => file.endsWith('module.ts') || file.endsWith('component.ts'));
  return tsFiles;
};

const listModulesToUpdateTSFile = async componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  const completeComponentPath = path.resolve(process.cwd(), componentPath);
  const availableModuleList = await _listAvailableExternalModules();
  const tsFilesToRead = listFilesInsidePath(completeComponentPath);
  const modulesToCopy = [];

  tsFilesToRead.map(tsFile => {
    const fileContent = fs.readFileSync(`${completeComponentPath}/${tsFile}`, 'utf8');
    availableModuleList.forEach(module => {
      if (fileContent.includes(module) && !completeComponentPath.includes(module) && !modulesToCopy.includes(module)) {
        modulesToCopy.push(module);
      }
    });
  });
  return modulesToCopy;
};

const moduleContainsExternalModules = async filePath => {
  const availableModuleList = await _listAvailableExternalModules();
  const tsFilesToRead = listFilesInsidePath(filePath);
  let hasExternalModules = false;

  tsFilesToRead.map(tsFile => {
    const fileContent = fs.readFileSync(`${filePath}/${tsFile}`, 'utf8');
    availableModuleList.forEach(module => {
      if (fileContent.includes(module) && !filePath.includes(module)) {
        hasExternalModules = true;
      }
    });
  });
  return hasExternalModules;
};

const moduleUseSharedFolder = async filePath => {
  const tsFilesToRead = listFilesInsidePath(filePath);
  let useSharedFolder = false;

  tsFilesToRead.map(tsFile => {
    const fileContent = fs.readFileSync(`${filePath}/${tsFile}`, 'utf8');
    if (fileContent.includes('shared') && !filePath.includes('shared')) {
      useSharedFolder = true;
    }
  });

  return useSharedFolder;
};

const removeSharedFolderFromComponent = componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  const componentSharedPath = path.resolve(process.cwd(), `${componentPath}/shared`);

  if (fs.existsSync(componentSharedPath)) {
    fs.removeSync(componentSharedPath);
  }
};

const removeModulesFolderFromComponent = async componentName => {
  const componentPath = angularComponentPath.replace('$1', componentName);
  const modulesToUpdateTSFile = await listModulesToUpdateTSFile(componentName);

  modulesToUpdateTSFile.map(module => {
    const copiedExternalModulePath = path.resolve(process.cwd(), `${componentPath}/${module}`);
    if (fs.existsSync(copiedExternalModulePath)) {
      fs.removeSync(copiedExternalModulePath);
    }
  });
};

const revertUpdateSharedImportsInTSFile = async componentPath => {
  glob(`${componentPath}/*.ts`)
    .then(files => {
      files.forEach(async file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const regExpShared = new RegExp(`from './shared`, 'g');
        const newFileContent = fileContent.replace(regExpShared, "from '../../shared");

        fs.writeFileSync(file, newFileContent, 'utf8');
      });
    })
    .catch(error => {
      console.error(error);
    });
};

const revertUpdateModulesImportsInTSFile = async (componentName, componentPath) => {
  const listCopiedModules = await listModulesToUpdateTSFile(componentName);

  listCopiedModules.map(module => {
    glob(`${componentPath}/*.ts`)
      .then(files => {
        files.forEach(async file => {
          const fileContent = fs.readFileSync(file, 'utf8');
          const regExpShared = new RegExp(`from './${module}`, 'g');
          const newFileContent = fileContent.replace(regExpShared, `from '../${module}`);

          fs.writeFileSync(file, newFileContent, 'utf8');
        });
      })
      .catch(error => {
        console.error(error);
      });
  });
};

const updateModulesImportsInTSFile = (componentPath, moduleName) => {
  moduleName.map(module => {
    glob(`${componentPath}/*.ts`, { ignore: ['**/*.spec.ts', '**/index.ts'] })
      .then(files => {
        if (files.length > 0) {
          files.forEach(file => {
            const fileContent = fs.readFileSync(file, 'utf8');

            if (fileContent.includes(module)) {
              const regExp = new RegExp(`from '[(.+)/]+(${module})+`, 'g');
              const newFileContent = fileContent.replace(regExp, `from './${module}`);
              fs.writeFileSync(file, newFileContent, 'utf8');
            }
          });
        }
      })
      .catch(error => {
        console.error(error);
      });
  });
};

const updateSharedImportsInTSFile = (componentPath, prefix) => {
  glob(`${componentPath}/*.ts`, { ignore: ['**/*.spec.ts', '**/index.ts'] })
    .then(files => {
      files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        const regExp = new RegExp(`from '[../]+[shared]+`, 'g');
        const sharedRelativePath = prefix === '..' ? `'${prefix}/shared` : `'./shared`;
        const newFileContent = fileContent.replace(regExp, `from ${sharedRelativePath}`);

        fs.writeFileSync(file, newFileContent, 'utf8');
      });
    })
    .catch(error => {
      console.error(error);
    });
};

const _listAvailableExternalModules = async () => {
  const availableModuleList = [];
  await listModulesAvalailable().then(componentsList => {
    componentsList.forEach(component => {
      availableModuleList.push(component.name);
    });
  });
  return availableModuleList;
};

const _removeFile = moduleToCopyPath => {
  fs.readdirSync(moduleToCopyPath).forEach(file => {
    if (file.includes('index.ts') || file.includes('ng-package.json') || file.includes('package.json')) {
      fs.unlinkSync(`${moduleToCopyPath}\\${file}`);
    }
  });
};

module.exports = {
  constructComponentPath: constructComponentPath,
  copyExternalModuleToComponentFolder: copyExternalModuleToComponentFolder,
  copySharedFolderToComponentFolder: copySharedFolderToComponentFolder,
  existComponentInPath: existComponentInPath,
  listModulesToUpdateTSFile: listModulesToUpdateTSFile,
  moduleContainsExternalModules: moduleContainsExternalModules,
  moduleUseSharedFolder: moduleUseSharedFolder,
  removeModulesFolderFromComponent: removeModulesFolderFromComponent,
  removeSharedFolderFromComponent: removeSharedFolderFromComponent,
  revertUpdateModulesImportsInTSFile: revertUpdateModulesImportsInTSFile,
  revertUpdateSharedImportsInTSFile: revertUpdateSharedImportsInTSFile,
  updateModulesImportsInTSFile: updateModulesImportsInTSFile,
  updateSharedImportsInTSFile: updateSharedImportsInTSFile,
};
