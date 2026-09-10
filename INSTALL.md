# Installation

## Manifest installation

Paste this address into Foundry's **Install Module** manifest field:

https://raw.githubusercontent.com/CalisteniaStudios/no-chat-pan/main/module.json

## Manual installation

1. Back up the Foundry data directory and stop the Foundry server.
2. Extract the release ZIP into `Data/modules/no-chat-pan/`.
3. Confirm `module.json` is directly inside that folder.
4. Restart Foundry, open the world, and enable **No Chat Pan** in Manage
   Modules.
5. Ask connected users to reload once after activation.

No settings or dependencies are required. While active, the module removes the
core **Pan to Token Speaker** option and prevents chat bubbles from panning the
camera. Disable the module and reload the page to restore Foundry's normal
behavior.
