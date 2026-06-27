# RAD4RFAKEDEAFEN

RAD4RFAKEDEAFEN is a native Vencord userplugin inspired by FakeDeafen. It adds a `/rad4rfakedeafen` command for toggling fake mute/deafen behavior while you are connected to a voice channel.

## Features

- Toggle fake mute/deafen with `/rad4rfakedeafen`
- Requires you to be connected to voice first
- Automatically restores WebSocket behavior when the plugin is disabled

## Install

1. In your Vencord source checkout, create this folder:

   ```text
   src/userplugins/RAD4RFAKEDEAFEN
   ```

2. Copy `index.ts` from this repo into that folder.
3. Build and install Vencord.
4. Restart Discord.

The plugin is marked as required, so it starts automatically after Vencord loads.

## Usage

1. Join a voice channel.
2. Run `/rad4rfakedeafen` to enable it.
3. Run `/rad4rfakedeafen` again to turn it off.

## Credits

Inspired by the original FakeDeafen plugin by arg0NNY/okdevme.
