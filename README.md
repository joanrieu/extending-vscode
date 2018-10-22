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

# Faire des appels à une API

VS Code ne restreint pas ce qu'il est possible de faire depuis une extension. Par exemple, on peut faire appel à une API HTTP comme on le ferait dans du code Node.js classique. On peut par exemple installer le package `node-fetch` et l'utiliser.

```js
import fetch from 'node-fetch';
// ...
const res = await fetch(url)
const json = await res.json()
```

# Conclusion

TODO
