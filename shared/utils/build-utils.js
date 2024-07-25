const angularBuildCommand = 'npx ng-packagr -p';
const angularComponentPath = './src/app/components/$1';
const angularSharedPath = './src/app/shared';
const packagrJsonName = 'ng-package.json';

module.exports = {
  angularBuildCommand: angularBuildCommand,
  angularComponentPath: angularComponentPath,
  angularSharedPath: angularSharedPath,
  packagrJsonName: packagrJsonName,
};
