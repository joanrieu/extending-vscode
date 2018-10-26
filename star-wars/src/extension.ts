// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as SWAPI from './SWAPI'

async function showCharacters() {
    const characters = await SWAPI.fetchCharacters()
    const names = characters.map(c => c.name)
    const characterName = await vscode.window.showQuickPick(names)
    if (characterName)
        vscode.window.showInformationMessage(characterName)
}

const swContentProvider: vscode.TextDocumentContentProvider = {
    async provideTextDocumentContent(uri, token) {
        const character = await SWAPI.fetchCharacter(uri.fragment)
        return `
# ${character.name}

${character.name} was born in the year ${character.birth_year}.

| Height                 | Mass                 |
|------------------------|----------------------|
| ${character.height} cm | ${character.mass} kg |
`
    }
}

const swTreeProvider: vscode.TreeDataProvider<SWAPI.Character> = {
    async getChildren(element?) {
        if (element)
            return []
        return await SWAPI.fetchCharacters()
    },
    getTreeItem(character) {
        const resourceUri = vscode.Uri.parse("sw://characters/" + character.name + "#" + character.url)
        return {
            resourceUri,
            command: {
                command: "markdown.showPreview",
                title: "Show character",
                arguments: [
                    resourceUri
                ]
            }
        }
    }
}

async function searchCharacters() {
    const qp = vscode.window.createQuickPick()
    qp.placeholder = "Start typing to search using the API"
    qp.onDidChangeValue(async input => {
        if (input) {
            qp.busy = true
            const characters = await SWAPI.searchCharactersByName(input)
            qp.items = characters.map(c => ({ label: c.name }))
            qp.busy = false
        } else {
            qp.items = []
        }
    })
    qp.show()
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("starWars.showCharacters", showCharacters)
    vscode.window.registerTreeDataProvider("starWars.characters", swTreeProvider)
    vscode.workspace.registerTextDocumentContentProvider("sw", swContentProvider)
    vscode.commands.registerCommand("starWars.searchCharacters", searchCharacters)
}

// this method is called when your extension is deactivated
export function deactivate() {
}
