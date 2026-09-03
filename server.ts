import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Server } from "socket.io";
import { createServer } from "http";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { gameData } from "./src/data";

import os from "os";

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  app.get('/api/lan-info', (req, res) => {
    res.json({ ip: getLocalIp(), port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000 });
  });

  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Global Game State
  const gameState = {
    team1Score: 0,
    team2Score: 0,
    currentRound: null as number | null,
    round1: {
      wordIndex: 0,
      timeLeft: 20,
      isActive: false,
      roundEnd: false
    },
    round2: {
      itemIndex: 0,
      isAnswerRevealed: false,
      roundEnd: false
    },
    round3: {
      themeIndex: 0,
      timeLeft: 60,
      isActive: false,
      roundEnd: false
    },
    round4: {
      itemIndex: 0,
      isAnswerRevealed: false,
      roundEnd: false
    },
    round5: {
      itemIndex: 0,
      isAnswerRevealed: false,
      roundEnd: false
    },
    round6: {
      currentThemeIndex: null,
      currentWordIndex: null,
      isAnswerRevealed: false
    },
    gameSettings: {
      isConfigured: false,
      type: "teams" as "teams" | "players",
      count: 2,
      participants: [] as { id: number; name: string; score: number }[]
    }
  };

  io.on("connection", (socket) => {
    // Send initial state to new clients
    socket.emit("state_update", gameState);

    // Act as a simple event broker
    socket.on("action", (action) => {
      switch (action.type) {
        case "UPDATE_SCORE": {
          const participant = gameState.gameSettings.participants.find(p => p.id === action.team);
          if (participant) {
            participant.score = Math.max(0, participant.score + action.delta);
            // Sync legacy fields for backward compatibility
            if (action.team === 1) gameState.team1Score = participant.score;
            if (action.team === 2) gameState.team2Score = participant.score;
          }
          break;
        }
        case "CONFIGURE_GAME": {
          const { mode, count, names } = action;
          const participants = [];
          for (let i = 1; i <= count; i++) {
            const defaultName = mode === "teams" ? `Команда ${i}` : `Участник ${i}`;
            const customName = names && names[i - 1] ? names[i - 1].trim() : "";
            participants.push({
              id: i,
              name: customName || defaultName,
              score: 0
            });
          }
          gameState.gameSettings = {
            isConfigured: true,
            type: mode,
            count,
            participants
          };
          // Reset legacy scores
          gameState.team1Score = 0;
          gameState.team2Score = 0;
          break;
        }
        case "RESET_GAME_SETTINGS": {
          gameState.gameSettings.isConfigured = false;
          break;
        }
        case "RESET_SCORES": {
          gameState.gameSettings.participants.forEach(p => {
            p.score = 0;
          });
          gameState.team1Score = 0;
          gameState.team2Score = 0;
          break;
        }
        case "SET_ROUND":
          gameState.currentRound = action.round;
          break;
        case "R1_START":
          gameState.round1.isActive = true;
          break;
        case "R1_PAUSE":
          gameState.round1.isActive = false;
          break;
        case "R1_NEXT_WORD":
          gameState.round1.wordIndex += 1;
          gameState.round1.timeLeft = 20;
          if (gameState.round1.wordIndex >= gameData.round1.words.length) { // Should match max words
            gameState.round1.roundEnd = true;
            gameState.round1.isActive = false;
          }
          break;
        case "R1_RESET":
          gameState.round1 = {
            wordIndex: 0,
            timeLeft: 20,
            isActive: false,
            roundEnd: false
          };
          break;
        case "R2_REVEAL_ANSWER":
          gameState.round2.isAnswerRevealed = true;
          break;
        case "R2_NEXT_ITEM":
          gameState.round2.itemIndex += 1;
          gameState.round2.isAnswerRevealed = false;
          if (gameState.round2.itemIndex >= gameData.round2.items.length) { // Should match max items
            gameState.round2.roundEnd = true;
          }
          break;
        case "R2_RESET":
          gameState.round2 = {
            itemIndex: 0,
            isAnswerRevealed: false,
            roundEnd: false
          };
          break;
        case "R3_START":
          gameState.round3.isActive = true;
          break;
        case "R3_PAUSE":
          gameState.round3.isActive = false;
          break;
        case "R3_NEXT_THEME":
          if (gameState.round3.themeIndex < gameData.round3.themes.length - 1) {
            gameState.round3.themeIndex += 1;
            gameState.round3.timeLeft = 60;
            gameState.round3.isActive = false;
          } else {
            gameState.round3.roundEnd = true;
            gameState.round3.isActive = false;
          }
          break;
        case "R3_RESET_TIME":
          gameState.round3.timeLeft = 60;
          gameState.round3.isActive = false;
          break;
        case "R3_RESET":
          gameState.round3 = {
            themeIndex: 0,
            timeLeft: 60,
            isActive: false,
            roundEnd: false
          };
          break;
        case "R4_REVEAL_ANSWER":
          gameState.round4.isAnswerRevealed = true;
          break;
        case "R4_NEXT_ITEM":
          gameState.round4.itemIndex += 1;
          gameState.round4.isAnswerRevealed = false;
          if (gameState.round4.itemIndex >= gameData.round4.items.length) { // Should match max items
            gameState.round4.roundEnd = true;
          }
          break;
        case "R4_RESET":
          gameState.round4 = {
            itemIndex: 0,
            isAnswerRevealed: false,
            roundEnd: false
          };
          break;
        case "R5_REVEAL_ANSWER":
          gameState.round5.isAnswerRevealed = true;
          break;
        case "R5_NEXT_ITEM":
          gameState.round5.itemIndex += 1;
          gameState.round5.isAnswerRevealed = false;
          if (gameState.round5.itemIndex >= gameData.round5.items.length) { // Should match max items
            gameState.round5.roundEnd = true;
          }
          break;
        case "R5_RESET":
          gameState.round5 = {
            itemIndex: 0,
            isAnswerRevealed: false,
            roundEnd: false
          };
          break;
        case "R6_SET_THEME":
          gameState.round6.currentThemeIndex = action.index;
          gameState.round6.currentWordIndex = null;
          gameState.round6.isAnswerRevealed = false;
          break;
        case "R6_SET_WORD":
          gameState.round6.currentWordIndex = action.index;
          gameState.round6.isAnswerRevealed = false;
          break;
        case "R6_REVEAL_ANSWER":
          gameState.round6.isAnswerRevealed = true;
          break;
        case "R6_RESET":
          gameState.round6 = {
            currentThemeIndex: null,
            currentWordIndex: null,
            isAnswerRevealed: false
          };
          break;
      }
      io.emit("state_update", gameState);
    });
  });

  // Server-side ticker for time-based events
  setInterval(() => {
    let statChanged = false;
    if (gameState.round1.isActive && !gameState.round1.roundEnd) {
      if (gameState.round1.timeLeft > 0) {
        gameState.round1.timeLeft -= 1;
        statChanged = true;
      }
      if (gameState.round1.timeLeft === 0) {
        // Auto skip
        gameState.round1.wordIndex += 1;
        gameState.round1.timeLeft = 20;
        statChanged = true;
        if (gameState.round1.wordIndex >= gameData.round1.words.length) {
          gameState.round1.roundEnd = true;
          gameState.round1.isActive = false;
        }
      }
    }
    
    if (gameState.round3.isActive && !gameState.round3.roundEnd) {
      if (gameState.round3.timeLeft > 0) {
        gameState.round3.timeLeft -= 1;
        statChanged = true;
      }
      if (gameState.round3.timeLeft === 0) {
        gameState.round3.isActive = false;
        statChanged = true;
      }
    }
    
    // No timer for round 5 now

    if (statChanged) {
      io.emit("state_update", gameState);
    }
  }, 1000);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: false,
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(process.cwd(), '.'),
        },
      },
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
