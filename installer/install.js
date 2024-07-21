const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function installComponent(componentName) {
  console.log(`Installing component ${componentName}`);
}

module.exports = { installComponent: installComponent };
