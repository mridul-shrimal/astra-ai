const db = require("../database/database");

/**
 * Save memory
 */
function saveMemory(userId, userMessage, aiResponse) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO memories
      (user_id, user_message, ai_response)
      VALUES (?, ?, ?)
    `;

    db.run(query, [userId, userMessage, aiResponse], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
}

/**
 * Get recent memories for ONE user
 */
function getRecentMemories(userId, limit = 10) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM memories
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(query, [userId, limit], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

/**
 * Get all memories
 */
function getAllMemories(userId, limit = 500) {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT *
      FROM memories
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `;

    db.all(
      query,
      [userId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

/**
 * Format memories for Astra
 */
async function getMemoryContext(userId, limit = 5) {
  const memories = await getRecentMemories(userId, limit);

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
function memoryExists(userId, memory) {
  return new Promise((resolve, reject) => {
    db.get(
      `
      SELECT id
      FROM memories
      WHERE user_id = ?
      AND LOWER(user_message) = LOWER(?)
      LIMIT 1
      `,
      [userId, memory],
      (err, row) => {
        if (err) reject(err);
        else resolve(!!row);
      }
    );
  });
}

/**
 * Find a memory with the same topic
 */
function findSimilarMemory(userId, memory) {
  return new Promise((resolve, reject) => {
    const keyword = memory
      .toLowerCase()
      .split(" ")
      .slice(0, 4)
      .join(" ");

    db.get(
      `
      SELECT *
      FROM memories
      WHERE user_id = ?
      AND LOWER(user_message) LIKE ?
      LIMIT 1
      `,
      [userId, `%${keyword}%`],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || null);
      }
    );
  });
}

/**
 * Clear one user's memories
 */
function clearMemories(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM memories WHERE user_id = ?`,
      [userId],
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
function getMemoryCount(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `
        SELECT COUNT(*) AS count
        FROM memories
        WHERE user_id = ?
      `,
      [userId],
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
function clearAllMemories(userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM memories WHERE user_id = ?`,
      [userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      }
    );
  });
}

/**
 * Update one memory
 */
function updateMemory(
  id,
  userId,
  userMessage,
  aiResponse
) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        UPDATE memories
        SET
          user_message = ?,
          ai_response = ?
        WHERE id = ?
          AND user_id = ?
      `,
      [
        userMessage,
        aiResponse,
        id,
        userId,
      ],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(
            new Error(
              "Memory not found or access denied."
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
 * Delete one memory
 */
function deleteMemory(id, userId) {
  return new Promise((resolve, reject) => {
    db.run(
      `
        DELETE FROM memories
        WHERE id = ?
          AND user_id = ?
      `,
      [id, userId],
      function (err) {
        if (err) {
          reject(err);
          return;
        }

        if (this.changes === 0) {
          reject(
            new Error(
              "Memory not found or access denied."
            )
          );
          return;
        }

        resolve();
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
  findSimilarMemory,
};

