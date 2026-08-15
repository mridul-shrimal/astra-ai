const {
  getMessages,
  saveMessage,
} = require("./messageService");
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
/**
 * Duplicate conversation with all messages
 */
async function duplicateConversation(
  sessionId,
  userId
) {
  console.log("📑 DUPLICATE REQUEST:");
  console.log("   sessionId:", sessionId);
  console.log("   userId:", userId);

  const original = await getConversation(
    sessionId,
    userId
  );

  console.log(
    "📑 ORIGINAL CONVERSATION:",
    original
  );

  if (!original) {
    throw new Error(
      "Conversation not found or access denied."
    );
  }

  // KEEP EVERYTHING BELOW YOUR EXISTING CODE

  const { randomUUID } = require("crypto");

  const newSessionId = randomUUID();

  await createConversation(
    newSessionId,
    `${original.title || "New Chat"} Copy`,
    userId
  );

  const messages = await getMessages(sessionId);

  for (const message of messages) {
    await saveMessage(
      newSessionId,
      message.sender,
      message.content
    );
  }

  return await getConversation(
    newSessionId,
    userId
  );
}

/**
 * Duplicate conversation
 */
async function duplicateConversation(
  sessionId,
  userId
) {
  // Verify original conversation belongs to user
  const original =
    await getConversation(
      sessionId,
      userId
    );

  if (!original) {
    throw new Error(
      "Conversation not found or access denied."
    );
  }

  // Get original messages
  const messages =
    await getMessages(sessionId);

  // Create new session ID
  const { randomUUID } =
    require("crypto");

  const newSessionId =
    randomUUID();

  // Create duplicate title
  const originalTitle =
    original.title?.trim() ||
    "New Chat";

  const newTitle =
    `${originalTitle} (Copy)`;

  // Create new conversation
  await createConversation(
    newSessionId,
    newTitle,
    userId
  );

  // Copy messages
  for (const message of messages) {
    await saveMessage(
      newSessionId,
      message.sender,
      message.content
    );
  }

  // Return the new conversation
  return {
    session_id: newSessionId,
    title: newTitle,
  };
}
module.exports = {
  createConversation,
  getAllConversations,
  getConversation,
  renameConversation,
  touchConversation,
  deleteConversation,
  duplicateConversation,
};