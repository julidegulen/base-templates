'use strict';

const format = require('stringformat');
const fs = require('fs-extra');
const hashBuilder = require('oc-hash-builder');
const handlebars = require('handlebars');
const ocViewWrapper = require('oc-view-wrapper');
const path = require('path');
const strings = require('./resources/strings');
const uglifyJs = require('uglify-js');

module.exports = (options, callback) => {
  const viewFileName = options.componentPackage.oc.files.template.src;
  const viewPath = path.join(options.componentPath, viewFileName);
  const viewContent = fs.readFileSync(viewPath, 'UTF8');
  const publishPath = options.publishPath;
  const publishFileName = options.publishFileName || 'template.js';

  if (!fs.existsSync(viewPath)) {
    return callback(format(strings.errors.VIEW_NOT_FOUND, viewFileName));
  }
  try {
    const view = handlebars.precompile(viewContent);
    const viewHash = hashBuilder.fromString(view);
    const compiledView = uglifyJs.minify(
      ocViewWrapper(viewHash, view.toString()),
      {
        fromString: true // NOTE: uglify-3 doesn't support this anymore.
      }
    ).code;

    fs.writeFile(path.join(publishPath, publishFileName), compiledView, err =>
      callback(err, {
        type: options.componentPackage.oc.files.template.type,
        hashKey: viewHash,
        src: publishFileName
      })
    );
  } catch (error) {
    return callback(
      format(strings.errors.COMPILATION_FAILED, viewFileName, error)
    );
  }
};
