"use strict";
const path = require('path');
const helpers = require('yeoman-test');
const spawn = require('execa');

const assert = require('assert');

describe('integration tests', function () {
    this.timeout(90000);

    it('command-ts integration test (install, compile and run extension tests)', function (done) {

        helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
            type: 'ext-command-ts',
            name: 'testCom',
            displayName: 'Test Com',
            description: 'My TestCom',
            gitInit: false,
            pkgManager: 'npm',
            openWith: 'skip'
        }).toPromise().then(runResult => {
            try {
                //console.log('command-ts with test: Running npm install');
                const res = spawn.sync('npm', ['i'], { cwd: runResult.env.cwd });
                if (res.exitCode !== 0) {
                    assert.fail(`npm installed failed: stdout ${res.stdout} stderr ${res.stderr}`);
                }

                // See https://overreacted.io/npm-audit-broken-by-design/
                // const resAudit = spawn.sync('npm', ['audit'], { cwd: runResult.env.cwd });
                // if (resAudit.exitCode !== 0) {
                //     assert.fail(`npm audit failed: stdout ${resAudit.stdout} stderr ${resAudit.stderr}`);
                // }

                const res2 = spawn.sync('npm', ['run', 'build'], { cwd: runResult.env.cwd });
                if (res2.exitCode !== 0) {
                    assert.fail(`npm run build failed: stdout ${res2.stdout} stderr ${res2.stderr}`);
                }

                runResult.assertFile('testCom/out/extension.js');

                done();
            } catch (e) {
                done(e);
            }
        });
    });

    it('command-ts-webpack integration test (install, pack and run extension tests)', function (done) {

        helpers.run(path.join(__dirname, '../generators/app')).withPrompts({
            type: 'ext-command-ts',
            name: 'testCom',
            displayName: 'Test Com',
            description: 'My TestCom',
            gitInit: false,
            pkgManager: 'npm',
            webpack: true,
            openWith: 'skip'
        }).toPromise().then(runResult => {
            try {
                //console.log('command-ts-webpack with test: Running npm install');
                const res = spawn.sync('npm', ['i'], { cwd: runResult.env.cwd });
                if (res.exitCode !== 0) {
                    assert.fail(`npm installed failed: stdout ${res.stdout} stderr ${res.stderr}`);
                }

                // See https://overreacted.io/npm-audit-broken-by-design/
                // const resAudit = spawn.sync('npm', ['audit'], { cwd: runResult.env.cwd });
                // if (resAudit.exitCode !== 0) {
                //     assert.fail(`npm audit failed: stdout ${resAudit.stdout} stderr ${resAudit.stderr}`);
                // }

                const res2 = spawn.sync('npm', ['run', 'build'], { cwd: runResult.env.cwd });
                if (res2.exitCode !== 0) {
                    assert.fail(`npm run build failed: stdout ${res2.stdout} stderr ${res2.stderr}`);
                }

                runResult.assertFile('testCom/dist/extension.js');

                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
