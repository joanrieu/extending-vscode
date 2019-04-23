import * as vscode from "vscode";
import * as SWAPI from "./SWAPI";

export function activate(context: vscode.ExtensionContext) {
  registerQuickPick();
  registerView();
  registerProvider();
}

function registerView() {
  vscode.window.registerTreeDataProvider("sw.characters", {
    getChildren() {
      return SWAPI.fetchCharacters();
    },
    getTreeItem(character: SWAPI.Character) {
      return {
        label: character.name,
        command: {
          command: "markdown.showPreview",
          title: "Preview",
          arguments: [
            vscode.Uri.parse("sw:" + character.name + "#" + character.url)
          ]
        }
      };
    }
  });
}

function registerProvider() {
  vscode.workspace.registerTextDocumentContentProvider("sw", {
    async provideTextDocumentContent(uri, token) {
      const character = await SWAPI.fetchCharacter(uri.fragment);
      return `
# ${character.name}

This character was born in ${character.birth_year}.

![](${await SWAPI.fetchCharacterImageURL(character.name)})
      `;
    }
  });
}

function registerQuickPick() {
  vscode.commands.registerCommand("sw.pick", async () => {
    const character = await vscode.window.showQuickPick(
      SWAPI.fetchCharacters().then(characters => characters.map(c => c.name))
    );
    if (character) vscode.window.showInformationMessage(character);
  });
}

export function deactivate() {}
