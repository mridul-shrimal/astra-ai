const db = require("../database/database");

/**
 * Save a conversation to memory
 */
function saveMemory(userMessage, aiResponse) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO memories (user_message, ai_response)
      VALUES (?, ?)
    `;

    db.run(query, [userMessage, aiResponse], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this.lastID);
      }
    });
  });
}

/**
 * Get recent conversation history
 */
function getRecentMemories(limit = 10) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM memories
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(query, [limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Format memories for Gemini
 */
async function getMemoryContext(limit = 5) {
  const memories = await getRecentMemories(limit);

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
 * Clear all memories
 */
function clearMemories() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM memories`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  saveMemory,
  getRecentMemories,
  getMemoryContext,
  clearMemories,
};