/*
 * Vencord userplugin
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { ApplicationCommandInputType, sendBotMessage } from "@api/Commands";
import definePlugin from "@utils/types";
import { SelectedChannelStore } from "@webpack/common";

const encoder = new TextEncoder();
const decoder = new TextDecoder("utf-8", { fatal: false });

let originalSend: typeof WebSocket.prototype.send | undefined;
let fakeEnabled = false;

function patchVoiceStatePayload(payload: string) {
    if (!fakeEnabled || !payload.includes("self_"))
        return payload;

    return payload
        .replaceAll('"self_deaf":false', '"self_deaf":true')
        .replaceAll('"self_mute":false', '"self_mute":true');
}

function isConnectedToVoice() {
    return Boolean(SelectedChannelStore.getVoiceChannelId());
}

function setFakeEnabled(enabled: boolean) {
    fakeEnabled = enabled;
    console.log(`[RAD4RFAKEDEAFEN] ${enabled ? "Enabled" : "Disabled"}`);
}

export default definePlugin({
    name: "RAD4RFAKEDEAFEN",
    description: "Adds a native Vencord fake mute/deafen toggle command.",
    tags: ["Voice", "Utility"],
    authors: [{ name: "RAD4R", id: 755936860932669541n }],
    dependencies: ["CommandsAPI"],
    required: true,

    commands: [{
        name: "rad4rfakedeafen",
        description: "Toggle RAD4RFAKEDEAFEN",
        inputType: ApplicationCommandInputType.BUILT_IN,
        execute: (_, ctx) => {
            if (fakeEnabled) {
                setFakeEnabled(false);
                sendBotMessage(ctx.channel.id, { content: "RAD4RFAKEDEAFEN disabled." });
                return;
            }

            if (!isConnectedToVoice()) {
                sendBotMessage(ctx.channel.id, { content: "Connect to a voice channel first." });
                return;
            }

            setFakeEnabled(true);
            sendBotMessage(ctx.channel.id, { content: "RAD4RFAKEDEAFEN enabled." });
        }
    }],

    start() {
        if (!originalSend)
            originalSend = WebSocket.prototype.send;

        WebSocket.prototype.send = function (data: string | ArrayBufferLike | Blob | ArrayBufferView) {
            if (!fakeEnabled)
                return originalSend!.call(this, data);

            if (typeof data === "string") {
                data = patchVoiceStatePayload(data);
            } else if (data instanceof ArrayBuffer) {
                const decoded = decoder.decode(data);
                if (decoded.includes("self_"))
                    data = encoder.encode(patchVoiceStatePayload(decoded)).buffer;
            } else if (ArrayBuffer.isView(data)) {
                const decoded = decoder.decode(data);
                if (decoded.includes("self_"))
                    data = encoder.encode(patchVoiceStatePayload(decoded));
            }

            return originalSend!.call(this, data);
        };

        console.log("[RAD4RFAKEDEAFEN] Started");
    },

    stop() {
        setFakeEnabled(false);
        if (originalSend) {
            WebSocket.prototype.send = originalSend;
            originalSend = undefined;
        }
    }
});
