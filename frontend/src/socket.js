
import { io } from "socket.io-client";

export const socket = io("https://diapo-app.onrender.com", {
  transports: ["poilling"],
});
