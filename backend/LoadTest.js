import { io } from "socket.io-client";

const URL = "https://quick-chat-e1f3.onrender.com";
const TOTAL_USERS = 1000;

let connected = 0;
let failed = 0;

for (let i = 0; i < TOTAL_USERS; i++) {
  const socket = io(URL, {
    transports: ["websocket"],
    reconnection: false, // disable auto reconnect
    query: {
      userId: `loadtest_${i}`,
    },
  });

  socket.on("connect", () => {
    connected++;
  });

  socket.on("connect_error", (err) => {
    failed++;
  });
}

// Print results after 30 seconds
setTimeout(() => {
  console.log("\n===== RESULTS =====");
  console.log("Connected:", connected);
  console.log("Failed:", failed);
  process.exit(0);
}, 30000);