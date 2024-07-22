#! /usr/bin/env node

const { program } = require("commander");
const package = require("./../package.json");
const builder = require("./../builder/build");
const installer = require("./../installer/install");

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
    const componentName = program.args[1];
    hasComponentName(component);
    builder.buildComponent(componentName);
  });

program
  .command('install [component]')
  .description("Install a component of design system")
  .action((component) => {
    const componentName = program.args[1];
    hasComponentName(component);
    installer.installComponent(componentName);
  });

program.parse(process.argv);
