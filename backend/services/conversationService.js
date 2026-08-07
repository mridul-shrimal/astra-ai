const db = require("../database/database");

/**
 * Create a conversation
 */
function createConversation(sessionId, title = "New Chat") {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO conversations
      (session_id, title)
      VALUES (?, ?)
    `;

    db.run(query, [sessionId, title], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

/**
 * Get all conversations
 */
function getAllConversations() {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM conversations
      ORDER BY updated_at DESC
    `;

    db.all(query, [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Get one conversation
 */
function getConversation(sessionId) {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT *
      FROM conversations
      WHERE session_id = ?
      LIMIT 1
      `,
      [sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

/**
 * Rename conversation
 */
function renameConversation(sessionId, title) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE conversations
      SET title = ?, updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ?
      `,
      [title, sessionId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Update conversation timestamp
 */
function touchConversation(sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE conversations
      SET updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ?
      `,
      [sessionId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Delete conversation
 */
function deleteConversation(sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM conversations WHERE session_id = ?`,
      [sessionId],
      function (err) {
        if (err) {
          console.error(
            "❌ Delete conversation error:",
            err.message
          );

          reject(err);
          return;
        }

        console.log(
          `🗑️ Deleted conversation: ${sessionId}`
        );

        resolve();
      }
    );
  });
}

module.exports = {
  createConversation,
  getAllConversations,
  getConversation,
  renameConversation,
  touchConversation,
  deleteConversation,
};