const db = require("../database/database");

/**
 * Create a conversation
 */
function createConversation(
  sessionId,
  title = "New Chat",
  userId = null
) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO conversations
      (session_id, title, user_id)
      VALUES (?, ?, ?)
    `;

    db.run(
      query,
      [sessionId, title, userId],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

/**
 * Get all conversations
 */
function getAllConversations(userId) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM conversations
      WHERE user_id = ?
      ORDER BY updated_at DESC
    `;

    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Get one conversation
 */
function getConversation(sessionId, userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT *
        FROM conversations
        WHERE session_id = ?
          AND user_id = ?
        LIMIT 1
      `,
      [sessionId, userId],
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
function renameConversation(sessionId, title, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE conversations
        SET title = ?, updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
          AND user_id = ?
      `,
      [title, sessionId, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(
            new Error(
              "Conversation not found or access denied."
            )
          );
          return;
        }

        resolve();
      }
    );
  });
}

/**
 * Update conversation timestamp
 */
function touchConversation(sessionId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE conversations
        SET updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ?
          AND user_id = ?
      `,
      [sessionId, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(
            new Error(
              "Conversation not found or access denied."
            )
          );
          return;
        }

        resolve();
      }
    );
  });
}

/**
 * Delete conversation
 */
function deleteConversation(sessionId, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM conversations
        WHERE session_id = ?
          AND user_id = ?
      `,
      [sessionId, userId],
      function (err) {
        if (err) {
          console.error(
            "❌ Delete conversation error:",
            err.message
          );

          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(
            new Error(
              "Conversation not found or access denied."
            )
          );
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