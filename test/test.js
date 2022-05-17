"use strict";
const path = require('path');
const helpers = require('yeoman-test');

const env = require('../generators/app/env');

function stripComments(content) {
    /**
    * First capturing group matches double quoted string
    * Second matches single quotes string
    * Third matches block comments
    * Fourth matches line comments
    */
    const regexp = /("(?:[^\\\"]*(?:\\.)?)*")|('(?:[^\\\']*(?:\\.)?)*')|(\/\*(?:\r?\n|.)*?\*\/)|(\/{2,}.*?(?:(?:\r?\n)|$))/g;
    const result = content.replace(regexp, (match, m1, m2, m3, m4) => {
        // Only one of m1, m2, m3, m4 matches
        if (m3) {
            // A block comment. Replace with nothing
            return '';
        } else if (m4) {
            // A line comment. If it ends in \r?\n then keep it.
            const length = m4.length;
            if (length > 2 && m4[length - 1] === '\n') {
                return m4[length - 2] === '\r' ? '\r\n' : '\n';
            } else {
                return '';
            }
        } else {
            // We match a string
            return match;
        }
    });
    return result;
}


describe('test code generator', function () {
    this.timeout(10000);

    let dependencyVersions;

    before(async function () {
        dependencyVersions = await env.getDependencyVersions();
    });

    function devDependencies(names) {
        const res = {};
        for (const name of names) {
            res[name] = dependencyVersions[name];
        }
        return res;
    }

    const standardFiles = ['package.json', 'README.md'];

    /**
     * @param {helpers.RunResult} runResult
     * @param {String} extensionName
     * @param {String[]} expectedFileNames
     */
    function assertFiles(runResult, extensionName, expectedFileNames) {
        const allFileNames = expectedFileNames.concat(standardFiles).map(fileName => `${extensionName}/${fileName}`);

        runResult.assertFile(allFileNames);
    }

    it('command-ts', function (done) {
        this.timeout(10000);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                type: 'ext-command-ts',
                name: 'testCom',
                displayName: 'Test Com',
                description: 'My TestCom',
                gitInit: true,
                pkgManager: 'npm',
                openWith: 'skip'
            }) // Mock the prompt answers
            .toPromise().then(runResult => {
                const expectedPackageJSON = {
                    "name": "testCom",
                    "displayName": 'Test Com',
                    "description": "My TestCom",
                    "version": "0.0.1",
                    "devDependencies": devDependencies([
                        "@types/flashpoint-launcher",
                        "@types/node",
                        "@typescript-eslint/parser",
                        "@typescript-eslint/eslint-plugin",
                        "eslint",
                        "gulp",
                        "gulp-zip",
                        "merge-stream",
                        "typescript"
                    ]),
                    "main": "./out/extension.js",
                    "scripts": {
                        "build": "tsc -p ./",
                        "lint": "eslint src --ext ts",
                        "watch": "tsc -watch -p ./"
                    },
                    "contributes": {
                        "devScripts": [{
                            "command": "testCom.hello-world",
                            "description": "Print Hello World Message",
                            "name": "Hello World (testCom)"
                        }]
                    }
                };
                try {
                    assertFiles(runResult, 'testCom', ['src/extension.ts', 'tsconfig.json']);

                    runResult.assertJsonFileContent('testCom/package.json', expectedPackageJSON);
                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('command-ts with yarn', function (done) {
        this.timeout(10000);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                type: 'ext-command-ts',
                name: 'testCom',
                displayName: 'Test Com',
                description: 'My TestCom',
                gitInit: false,
                pkgManager: 'yarn',
                openWith: 'skip'
            }) // Mock the prompt answers
            .toPromise().then(runResult => {
                const expectedPackageJSON = {
                    "name": "testCom",
                    "displayName": 'Test Com',
                    "description": "My TestCom",
                    "version": "0.0.1",
                    "devDependencies": devDependencies([
                        "@types/flashpoint-launcher",
                        "@types/node",
                        "@typescript-eslint/parser",
                        "@typescript-eslint/eslint-plugin",
                        "eslint",
                        "gulp",
                        "gulp-zip",
                        "merge-stream",
                        "typescript"
                    ]),
                    "main": "./out/extension.js",
                    "scripts": {
                        "build": "tsc -p ./",
                        "lint": "eslint src --ext ts",
                        "watch": "tsc -watch -p ./"
                    },
                    "contributes": {
                        "devScripts": [{
                            "command": "testCom.hello-world",
                            "description": "Print Hello World Message",
                            "name": "Hello World (testCom)"
                        }]
                    }
                };
                const expectedTsConfig = {
                    "compilerOptions": {
                        "module": "commonjs",
                        "target": "ES2020",
                        "outDir": "out",
                        "lib": [
                            "ES2020"
                        ],
                        "sourceMap": true,
                        "rootDir": "src",
                        "strict": true
                    }
                };
                try {
                    assertFiles(runResult, 'testCom', ['src/extension.ts', 'tsconfig.json', '.eslintrc.json']);

                    runResult.assertJsonFileContent('testCom/package.json', expectedPackageJSON);

                    const tsconfigBody = JSON.parse(stripComments(runResult.fs.read('testCom/tsconfig.json')));
                    runResult.assertObjectContent(tsconfigBody, expectedTsConfig);

                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('command-ts with webpack', function (done) {
        this.timeout(10000);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                type: 'ext-command-ts',
                name: 'testCom',
                displayName: 'Test Com',
                description: 'My TestCom',
                gitInit: true,
                pkgManager: 'npm',
                webpack: true,
                openWith: 'skip'
            }) // Mock the prompt answers
            .toPromise().then(runResult => {
                const expectedPackageJSON = {
                    "name": "testCom",
                    "displayName": 'Test Com',
                    "description": "My TestCom",
                    "version": "0.0.1",
                    "devDependencies": devDependencies([
                        "@types/flashpoint-launcher",
                        "@types/node",
                        "@typescript-eslint/parser",
                        "@typescript-eslint/eslint-plugin",
                        "eslint",
                        "gulp",
                        "gulp-zip",
                        "merge-stream",
                        "typescript",
                        "webpack",
                        "webpack-cli",
                        "ts-loader"
                    ]),
                    "main": "./dist/extension.js",
                    "scripts": {
                        "build": "webpack",
                        "watch": "webpack --watch",
                        "package": "gulp",
                        "lint": "eslint src --ext ts"
                    },
                    "contributes": {
                        "devScripts": [{
                            "command": "testCom.hello-world",
                            "description": "Print Hello World Message",
                            "name": "Hello World (testCom)"
                        }]
                    }
                };
                try {


                    assertFiles(runResult, 'testCom', ['src/extension.ts', 'tsconfig.json']);

                    runResult.assertJsonFileContent('testCom/package.json', expectedPackageJSON);

                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('command-js', function (done) {
        this.timeout(10000);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                type: 'ext-command-js',
                name: 'testCom',
                displayName: 'Test Com',
                description: 'My TestCom',
                checkJavaScript: false,
                gitInit: false,
                pkgManager: 'npm',
                openWith: 'skip'
            }) // Mock the prompt answers
            .toPromise().then(runResult => {
                const expectedPackageJSON = {
                    "name": "testCom",
                    "displayName": 'Test Com',
                    "description": "My TestCom",
                    "version": "0.0.1",
                    "devDependencies": devDependencies([
                        "@types/flashpoint-launcher",
                        "@types/node",
                        "eslint",
                        "gulp",
                        "gulp-zip",
                        "merge-stream",
                        "typescript"
                    ]),
                    "main": "./extension.js",
                    "scripts": {
                        "lint": "eslint ."
                    },
                    "contributes": {
                        "devScripts": [{
                            "command": "testCom.hello-world",
                            "description": "Print Hello World Message",
                            "name": "Hello World (testCom)"
                        }]
                    }
                };
                try {
                    assertFiles(runResult, 'testCom', ['extension.js', 'jsconfig.json']);

                    runResult.assertJsonFileContent('testCom/package.json', expectedPackageJSON);

                    done();
                } catch (e) {
                    done(e);
                }
            });
    });

    it('command-js with check JS', function (done) {
        this.timeout(10000);

        helpers.run(path.join(__dirname, '../generators/app'))
            .withPrompts({
                type: 'ext-command-js',
                name: 'testCom',
                displayName: 'Test Com',
                description: 'My TestCom',
                checkJavaScript: true,
                gitInit: false,
                pkgManager: 'yarn',
                openWith: 'skip'
            }) // Mock the prompt answers
            .toPromise().then(runResult => {
                const expectedJSConfig = {
                    "compilerOptions": {
                        "module": "commonjs",
                        "target": "ES2020",
                        "checkJs": true,
                        "lib": [
                            "ES2020"
                        ]
                    },
                    "exclude": [
                        "node_modules"
                    ]
                };
                try {
                    const jsconfigBody = JSON.parse(stripComments(runResult.fs.read('testCom/jsconfig.json')));
                    runResult.assertObjectContent(jsconfigBody, expectedJSConfig);

                    done();
                } catch (e) {
                    done(e);
                }
            });
    });
});
