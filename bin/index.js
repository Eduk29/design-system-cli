#! /usr/bin/env node

const { program } = require("commander");
const package = require("./../package.json");
const builder = require("./../builder/build");
const installer = require("./../installer/install");

const callBuilder = () => {
  const componentName = program.args[1];
  builder.buildComponent(componentName);
};

const callInstaller = () => {
  const componentName = program.args[1];
  installer.installComponent(componentName);
};

const hasComponentName = (component) => {
  if (Object.keys(component).length === 0) {
    console.error("Please provide a component name");
    program.help();
  }
};

program.version(package.version);

program
  .command('build [component]')
  .description("Build a component of design system")
  .action((component) => {
    hasComponentName(component);
    callBuilder();
  });

program
  .command('install [component]')
  .description("Install a component of design system")
  .action((component) => {
    hasComponentName(component);
    callInstaller();
  });

program.parse(process.argv);
