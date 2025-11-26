import { io } from "socket.io-client";

export const RateConfigKey = "nakoda_bullion";

export function extract() {
    return new Promise((resolve, reject) => {
        const socket = io("https://starlinetechno.in:10001", {
            transports: ["polling"],          // ✅ no websocket attempt
            upgrade: false,                   // ✅ DO NOT try websocket
            path: "/socket.io",
            rejectUnauthorized: false,
            allowEIO3: true,
            extraHeaders: {
                Origin: "https://nakodabullion.com",
                Referer: "https://nakodabullion.com/",
                "User-Agent": "Mozilla/5.0"
            },
            path: "/socket.io"
        });

        const timeout = setTimeout(() => {
            socket.disconnect();
            reject(new Error("Timeout waiting for Liverate"));
        }, 5000);

        socket.on("Liverate", (data) => {
            clearTimeout(timeout);

            let gold = data.find(i => i.symbol === "gold")?.Ask || null;
            let silver = data.find(i => i.symbol === "silver")?.Ask || null;
            silver = parseFloat(silver) || 0;
            silver = silver / 1000;
            socket.disconnect();
            resolve([gold, silver]);
        });

        socket.emit("subscribe", "Liverate");
    });
}
