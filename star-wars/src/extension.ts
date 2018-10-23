'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import fetch from 'node-fetch';

async function fetchApi(...args: (string | number)[]) {
    const url = ["https://swapi.co/api", ...args].join("/")
    // vscode.window.showInformationMessage("Fetching " + url)
    try {
        const res = await fetch(url)
        const json = await res.json()
        // vscode.window.showInformationMessage("Received " + JSON.stringify(json))
        return json
    } catch (err) {
        // vscode.window.showErrorMessage(err.message)
    }
}

interface Character {
    name: string
}

async function fetchCharacters(): Promise<Character[]> {
    const { results } = await fetchApi("people")
    return results
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
            return {
                label: character.name
            }
        }
    })
}

// this method is called when your extension is deactivated
export function deactivate() {
}
