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
 * Get all memories
 */
function getAllMemories(limit = 500) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM memories
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(query, [limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Format memories for Astra
 */
async function getMemoryContext(sessionId, limit = 5) {
  const memories = await getRecentMemories(sessionId, limit);

  if (!memories.length) {
    return "";
  }

  return (
    "Known facts about the user:\n\n" +
    memories
      .reverse()
      .map((memory) => `- ${memory.user_message}`)
      .join("\n")
  );
}

/**
 * Check whether a memory already exists
 */
function memoryExists(sessionId, memory) {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT id
      FROM memories
      WHERE session_id = ?
      AND LOWER(user_message) = LOWER(?)
      LIMIT 1
      `,
      [sessionId, memory],
      (err, row) => {
        if (err) reject(err);
        else resolve(!!row);
      }
    );
  });
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
/**
 * Count all stored memories
 */
function getMemoryCount() {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) AS count FROM memories`,
      [],
      (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      }
    );
  });
}

/**
 * Clear all memories
 */
function clearAllMemories() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM memories`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Update one memory
 */
function updateMemory(id, userMessage, aiResponse) {
  return new Promise((resolve, reject) => {
    db.run(
      `
      UPDATE memories
      SET
        user_message = ?,
        ai_response = ?
      WHERE id = ?
      `,
      [userMessage, aiResponse, id],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

/**
 * Delete one memory
 */
function deleteMemory(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM memories WHERE id = ?`,
      [id],
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
  getAllMemories,
  getMemoryContext,
  clearMemories,
  clearAllMemories,
  getMemoryCount,
  updateMemory,
  deleteMemory,
  memoryExists,
};

console.log("MemoryService exports:");
console.log(module.exports);