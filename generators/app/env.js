/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';
const fs = require('fs');
const path = require('path');

module.exports.getDependencyVersions = async function () {
    const versions = JSON.parse((await fs.promises.readFile(path.join(__dirname, 'dependencyVersions', 'package.json'))).toString()).dependencies;
    return versions;
}
