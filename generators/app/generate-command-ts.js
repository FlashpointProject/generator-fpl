const chalk = require("chalk");
const prompts = require("./prompts");

module.exports = {
    id: 'ext-command-ts',
    aliases: ['ts', 'command-ts'],
    name: 'New Extension (TypeScript)',
    insidersName: 'New Extension with Proposed API (TypeScript)',
    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} extensionConfig
     */
    prompting: async (generator, extensionConfig) => {
        await prompts.askForExtensionDisplayName(generator, extensionConfig);
        await prompts.askForExtensionId(generator, extensionConfig);
        await prompts.askForExtensionDescription(generator, extensionConfig);

        await prompts.askForGit(generator, extensionConfig);
        await prompts.askForWebpack(generator, extensionConfig);
        await prompts.askForPackageManager(generator, extensionConfig);
    },
    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} extensionConfig
     */
    writing: (generator, extensionConfig) => {
        if (extensionConfig.webpack) {
            generator.fs.copyTpl(generator.templatePath('vscode-webpack/package.json'), generator.destinationPath('package.json'), extensionConfig);
            generator.fs.copyTpl(generator.templatePath('vscode-webpack/tsconfig.json'), generator.destinationPath('tsconfig.json'), extensionConfig);
            generator.fs.copyTpl(generator.templatePath('vscode-webpack/webpack.config.js'), generator.destinationPath('webpack.config.js'), extensionConfig);
        } else {
            generator.fs.copyTpl(generator.templatePath('package.json'), generator.destinationPath('package.json'), extensionConfig);
            generator.fs.copyTpl(generator.templatePath('tsconfig.json'), generator.destinationPath('tsconfig.json'), extensionConfig);
        }

        if (extensionConfig.gitInit) {
            generator.fs.copy(generator.templatePath('gitignore'), generator.destinationPath('.gitignore'));
        }
        generator.fs.copyTpl(generator.templatePath('README.md'), generator.destinationPath('README.md'), extensionConfig);
        generator.fs.copyTpl(generator.templatePath('src/extension.ts'), generator.destinationPath('src/extension.ts'), extensionConfig);
        generator.fs.copy(generator.templatePath('.eslintrc.json'), generator.destinationPath('.eslintrc.json'));

        if (extensionConfig.pkgManager === 'yarn') {
            generator.fs.copyTpl(generator.templatePath('.yarnrc'), generator.destinationPath('.yarnrc'), extensionConfig);
        }

        extensionConfig.installDependencies = true;
        extensionConfig.proposedAPI = extensionConfig.insiders;
    },

    /**
     * @param {import('yeoman-generator')} generator
     * @param {Object} extensionConfig
     */
    endMessage: (generator, extensionConfig) => {
        if (extensionConfig.webpack) {
            generator.log(chalk.yellow(`To run the extension you need to install the recommended extension 'amodio.tsl-problem-matcher'.`));
            generator.log('');
        }
    }
}
