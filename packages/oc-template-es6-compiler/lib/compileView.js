'use strict';

const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
// const jade = require('jade-legacy');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const strings = require('oc-templates-messages');
const uglifyJs = require('uglify-js');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath, 'UTF8');
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';

  if (!fs.existsSync(viewPath)) {
    return callback(strings.errors.viewNotFound(viewFileName));
  }

  try {
    const compiledView = viewContent.toString();
    const viewHash = hashBuilder.fromString(compiledView);
    // const compiledView = viewContent.replace('"', '\\"');

    fs.ensureDirSync(publishPath);
    fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
      callback(err, {
        template: {
          type: options.componentPackage.oc.files.template.type,
          hashKey: viewHash,
          src: publishFileName
        }
      })
    );
  } catch (error) {
    return callback(strings.errors.compilationFailed(viewFileName, error));
  }
};
