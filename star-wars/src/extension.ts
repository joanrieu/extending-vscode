'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

interface Character {
    name: string
    url: string
    height: string
    mass: string
    birth_year: string
}

async function fetchCharacters(): Promise<Character[]> {
    const res = await fetch("https://swapi.co/api/people")
    const { results } = await res.json()
    return results
}

async function fetchCharacter(uri: string): Promise<Character> {
    const res = await fetch(uri)
    const json = await res.json()
    return json
}

async function showCharacters() {
    const characters = await fetchCharacters()
    const names = characters.map(c => c.name)
    const characterName = await vscode.window.showQuickPick(names)
    if (characterName)
        vscode.window.showInformationMessage(characterName)
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    vscode.commands.registerCommand("starWars.showCharacters", showCharacters)
    vscode.window.registerTreeDataProvider("starWars.view", {
        async getChildren(element?) {
            if (element)
                return []
            return await fetchCharacters()
        },
        getTreeItem(character: Character) {
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
    })
    vscode.workspace.registerTextDocumentContentProvider("sw", {
        async provideTextDocumentContent(uri, token) {
            const character = await fetchCharacter(uri.fragment)
            return `
# ${character.name}

${character.name} was born in the year ${character.birth_year}.

| Height                 | Mass                 |
|------------------------|----------------------|
| ${character.height} cm | ${character.mass} kg |
`
        }
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
}
