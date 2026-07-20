const db = require("../database/database");

/**
 * Save memory
 */
function saveMemory(sessionId, userMessage, aiResponse) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO memories
      (session_id, user_message, ai_response)
      VALUES (?, ?, ?)
    `;

    db.run(query, [sessionId, userMessage, aiResponse], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

/**
 * Get recent memories for ONE session
 */
function getRecentMemories(sessionId, limit = 10) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM memories
      WHERE session_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(query, [sessionId, limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Format memories for Gemini
 */
async function getMemoryContext(sessionId, limit = 5) {
  const memories = await getRecentMemories(sessionId, limit);

  if (!memories.length) {
    return "";
  }

  return memories
    .reverse()
    .map(
      (memory) =>
        `User: ${memory.user_message}\nAstra: ${memory.ai_response}`
    )
    .join("\n\n");
}

/**
 * Clear one session
 */
function clearMemories(sessionId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM memories WHERE session_id = ?`,
      [sessionId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = {
  saveMemory,
  getRecentMemories,
  getMemoryContext,
  clearMemories,
};