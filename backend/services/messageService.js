const db = require("../database/database");

// =========================
// Save Message
// =========================

function saveMessage(sessionId, sender, content) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      INSERT INTO messages (
        session_id,
        sender,
        content
      )
      VALUES (?, ?, ?)
      `,
      [sessionId, sender, content],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

// =========================
// Get Messages
// =========================

function getMessages(sessionId) {
  return new Promise((resolve, reject) => {
    db.all(
      `
      SELECT *
      FROM messages
      WHERE session_id = ?
      ORDER BY created_at ASC
      `,
      [sessionId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// =========================
// Delete Messages
// =========================

function deleteMessages(sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      DELETE FROM messages
      WHERE session_id = ?
      `,
      [sessionId],
      function (err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
}

module.exports = {
  saveMessage,
  getMessages,
  deleteMessages,
};