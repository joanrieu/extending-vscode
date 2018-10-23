---
title: Étendre VS Code
subtitle: ou comment se créer un back-office en 10 min
---

# Abstract

Construire sa propre extension VS Code, ça se fait en un rien de temps, alors s'il y a des tâches récurrentes dans votre quotidien de développeur, vous n'aurez plus d'excuse pour ne pas les automatiser !

Au programme : live-coding d'une UI intégrée à VS Code qui accède à un service REST.

Visual Studio Code dispose d'une API concise et très facile à prendre en main. Les possibilités sont infinies : questions-réponses interactives, affichage d'arborescence, HTML, notifications, appels HTTP, messages RabbitMQ, lecture de fichiers, etc.

# Introduction

TODO

# Créer une extension

Générer à partir d'un template via Yeoman:

```sh
npx -p yo -p generator-code yo code
```

Des sources d'exemple sont générées, y compris les tâches nécessaires pour démarrer l'extension en mode debug depuis VS Code. Appuyer sur F5 pour lancer la tâche. Un exemple de commande "Hello World" est déjà implémenté.

Pour afficher un message, il suffit de faire :

```js
vscode.window.showInformationMessage('Hello World!');
```

Pour déclarer une commande VS Code correspondant à une fonction, il suffit d'appeler :

```js
vscode.commands.registerCommand('extension.sayHello', sayHello)
```

Le texte affiché pour décrire une commande est défini dans le fichier `package.json` :

```js
"contributes": {
    "commands": [
        {
            "command": "starWars.showCharacters",
            "title": "Show characters",
            "category": "Star Wars"
        }
    ]
}
```

# Faire des appels à une API

VS Code ne restreint pas ce qu'il est possible de faire depuis une extension. Par exemple, on peut faire appel à une API HTTP comme on le ferait dans du code Node.js classique. On peut par exemple installer le package `node-fetch` et l'utiliser.

```js
import fetch from 'node-fetch';
// ...
const res = await fetch(url)
const json = await res.json()
```

# Interagir avec l'utilisateur

Il est possible de poser des questions à l'utilisateur ou d'afficher des menus déroulants présentant des résultats de recherche comme ceci :

```js
const characterName = await vscode.window.showQuickPick(names)
if (characterName)
    vscode.window.showInformationMessage(characterName)
```

# Ajouter un explorateur

Il est possible de créer de nouveaux explorateurs dans l'interface, via le fichier `package.json` :

```js
"contributes": {
    "views": {
        "explorer": [
            {
                "id": "starWars.view",
                "name": "Star Wars"
            }
        ]
    }
}
```

Il serait même possible de rajouter une nouvelle icône dans la barre latérale pour isoler notre explorateur :

```js
"contributes": {
    "viewsContainers": {
        "activitybar": [
            {
                "id": "starWars",
                "title": "Star Wars",
                "icon": ""
            }
        ]
    },
    "views": {
        "starWars": [
            {
                "id": "starWars.view",
                "name": "Star Wars"
            }
        ]
    }
}
```

Pour ajouter des données à l'intérieur de l'explorateur, il suffit d'implémenter l'interface `TreeDataProvider` :

```ts
vscode.window.registerTreeDataProvider("starWars.view", {
    async getChildren(element?) {
        if (element)
            return [] // no subitems
        return await fetchCharacters()
    },
    getTreeItem(character: Character) {
        return {
            label: character.name
        }
    }
})
```

Pour que les données soient récupérées dès le démarrage de l'application, il faut modifier le `package.json` :

```js
"activationEvents": [
    "*"
]
```

# Conclusion

TODO
