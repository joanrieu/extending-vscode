import * as vscode from "vscode";
import * as SWAPI from "./SWAPI";

export function activate(context: vscode.ExtensionContext) {
  vscode.commands.registerCommand("sw.pick", () => {
    vscode.window.showQuickPick(
      SWAPI.fetchCharacters().then(characters => characters.map(c => c.name))
    );
  });
}

export function deactivate() {}
