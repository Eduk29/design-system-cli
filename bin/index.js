#! /usr/bin/env node
const { program } = require('commander');
const packageJson = require('./../package.json');
const builder = require('./../builder/build');
const installer = require('./../installer/install');

program.version(packageJson.version);

program
  .command('build [component]')
  .description('Build a component of design system')
  .action(component => {
    if (component) {
      const componentName = program.args[1];
      builder.buildComponent(componentName);
    } else {
      console.error('Please provide a component name');
      program.help();
    }
  });

program
  .command('install [component]')
  .description('Install a component of design system')
  .action(component => {
    if (component) {
      const componentName = program.args[1];
      installer.installComponent(componentName);
    } else {
      console.error('Please provide a component name');
      program.help();
    }
  });

program.parse(process.argv);
