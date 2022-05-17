// The module 'flashpoint-launcher' contains the Flashpoint Launcher extensions API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('flashpoint-launcher');

// this method is called when your extension is activated
/**
 * @param {flashpoint.ExtensionContext} context
 */
function activate(context) {
	// Use the logs page to output debug information (flashpoint.log.debug) and errors (flashpoint.log.error)
	// This line of code will only be executed once when your extension is activated
	flashpoint.log.debug('Congratulations, your extension "<%= name %>" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('<%= name %>.helloWorld', async function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		await flashpoint.dialogs.showMessageBox({
			title: 'Message Box',
			message: 'Hello World from <%= displayName %>!',
			buttons: ['OK']
		});
	});

	flashpoint.registerDisposable(context.subscriptions, disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
