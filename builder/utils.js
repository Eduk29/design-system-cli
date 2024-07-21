const fs = require("fs-extra");

function existComponentInPath(componentName, componentPath) {
  if (!fs.existsSync(componentPath)) {
    console.error(`Component ${componentName} not found in ${componentPath}`);
    process.exit(1);
  }
}

function revertUpdateImportsInTSFile(file) {
  const fileContent = fs.readFileSync(file, "utf8");

  const newFileContent = fileContent.replace(
    /from '.\/shared\//g,
    "from '@design-system/shared/"
  );

  fs.writeFileSync(file, newFileContent, "utf8");
}

function updateImportsInTSFile(file) {
  const fileContent = fs.readFileSync(file, "utf8");

  const newFileContent = fileContent.replace(
    /from '@design-system\/shared/g,
    `from './shared`
  );

  fs.writeFileSync(file, newFileContent, "utf8");
}

module.exports = {
  existComponentInPath: existComponentInPath,
  revertUpdateImportsInTSFile: revertUpdateImportsInTSFile,
  updateImportsInTSFile: updateImportsInTSFile,
};
