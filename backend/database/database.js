const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Path to database file
const dbPath = path.join(__dirname, "astra.db");

console.log("📁 SQLite database path:", dbPath);

// Create/Open database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "❌ Database connection failed:",
      err.message
    );
    return;
  }

  console.log("✅ Connected to Astra Database");

  // =========================
  // Memories
  // =========================

  db.run(
    `CREATE TABLE IF NOT EXISTS memories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_message TEXT NOT NULL,
      ai_response TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(
          "❌ Memory table error:",
          err.message
        );
      } else {
        console.log("🧠 Memory table ready.");
      }
    }
  );

  // =========================
  // Conversations
  // =========================

  db.run(
    `CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL DEFAULT 'New Chat',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    (err) => {
      if (err) {
        console.error(
          "❌ Conversations table error:",
          err.message
        );
        return;
      }

      console.log("💬 Conversations table ready.");

      // =========================
      // Add user_id to existing DB
      // =========================

      db.all(
        `PRAGMA table_info(conversations)`,
        (err, columns) => {
          if (err) {
            console.error(
              "❌ Failed to inspect conversations table:",
              err.message
            );
            return;
          }

          const hasUserId = columns.some(
            (column) => column.name === "user_id"
          );

          if (hasUserId) {
            console.log(
              "👤 conversations.user_id already exists."
            );

            createMessagesTable();
            return;
          }

          console.log(
            "🔄 Adding user_id to conversations..."
          );

          db.run(
            `ALTER TABLE conversations
             ADD COLUMN user_id TEXT`,
            (err) => {
              if (err) {
                console.error(
                  "❌ Failed to add user_id:",
                  err.message
                );
                return;
              }

              console.log(
                "👤 conversations.user_id added."
              );

              /*
               * Existing conversations were created before
               * user ownership was implemented.
               *
               * Leave them NULL for now rather than assigning
               * them to the wrong user.
               *
               * New conversations will receive the authenticated
               * user's ID.
               */

              createMessagesTable();
            }
          );
        }
      );
    }
  );

  // =========================
  // Messages
  // =========================

  function createMessagesTable() {
    db.run(
      `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(session_id)
          REFERENCES conversations(session_id)
          ON DELETE CASCADE
      )`,
      (err) => {
        if (err) {
          console.error(
            "❌ Messages table error:",
            err.message
          );
        } else {
          console.log(
            "💬 Messages table ready."
          );
        }
      }
    );
  }
});

module.exports = db;