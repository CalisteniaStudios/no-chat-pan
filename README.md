# No Chat Pan

No Chat Pan completely prevents Foundry chat bubbles from moving a
client's camera while the module is active.

## Behavior

- Blocks the core `Pan to Token Speaker` behavior for every connected client.
- Hides that core option while the module is active.
- Keeps chat messages and chat bubbles working normally.
- Does not block manual panning, pings, scene navigation, token control, combat
  camera tools, or camera movement requested by unrelated modules.
- Does not write over the user's saved core preference. Disable the module and
  reload to restore normal Foundry behavior and the original option.

The module is system-agnostic, supports Foundry VTT 13 and 14, and has no module
dependencies.

## Installation

See [INSTALL.md](INSTALL.md). The module is public and free. It can be installed
using its manifest URL or the ZIP attached to each GitHub release.

## License and support

Copyright (c) 2026 Calistenia Studios. This module is available under the MIT
License. See [LICENSE](LICENSE). Support and our other Foundry modules are available through
https://www.patreon.com/cw/CalisteniaStudios.

Foundry Virtual Tabletop is a trademark of Foundry Gaming LLC. This module is
not affiliated with or endorsed by Foundry Gaming LLC.
