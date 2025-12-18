const pool = require("../config/database");

const NOTIFICATION_ROLES = "('student','mentor','admin','company')";

async function ensureNotificationsTable() {
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      role VARCHAR(20) NOT NULL CHECK (role IN ${NOTIFICATION_ROLES}),
      recipient_id INTEGER,
      notification_type VARCHAR(50) NOT NULL DEFAULT 'general',
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      link TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS role VARCHAR(20);`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_id INTEGER;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS notification_type VARCHAR(50);`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS title TEXT;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS message TEXT;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();`,
    `ALTER TABLE notifications ADD COLUMN IF NOT EXISTS recipient_role VARCHAR(20);`,
    `DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'notifications'::regclass
          AND conname = 'notifications_role_check'
      ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_role_check CHECK (role IN ${NOTIFICATION_ROLES});
      END IF;
    END$$;`,
    `DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conrelid = 'notifications'::regclass
          AND conname = 'notifications_recipient_role_check'
      ) THEN
        ALTER TABLE notifications
        ADD CONSTRAINT notifications_recipient_role_check CHECK (recipient_role IN ${NOTIFICATION_ROLES});
      END IF;
    END$$;`,
    `UPDATE notifications SET recipient_role = role WHERE recipient_role IS NULL;`,
    `UPDATE notifications SET notification_type = 'general' WHERE notification_type IS NULL OR notification_type = '';`,
    `ALTER TABLE notifications ALTER COLUMN metadata SET DEFAULT '{}'::jsonb;`,
    `ALTER TABLE notifications ALTER COLUMN is_read SET DEFAULT FALSE;`,
    `ALTER TABLE notifications ALTER COLUMN created_at SET DEFAULT NOW();`,
    `ALTER TABLE notifications ALTER COLUMN recipient_id DROP NOT NULL;`,
    `ALTER TABLE notifications ALTER COLUMN recipient_role SET NOT NULL;`,
    `ALTER TABLE notifications ALTER COLUMN notification_type SET DEFAULT 'general';`,
    `ALTER TABLE notifications ALTER COLUMN notification_type SET NOT NULL;`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_role ON notifications(role);`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_recipient_role ON notifications(role, recipient_id);`,
    `CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(notification_type);`,
  ];

  const maxRetries = 5;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      for (const q of queries) {
        await pool.query(q);
      }
      // success
      return;
    } catch (err) {
      const isConnReset = err && (err.code === 'ECONNRESET' || err.message && err.message.includes('ECONNRESET'));
      console.error(`ensureNotificationsTable attempt ${attempt} failed:`, err && err.message ? err.message : err);
      if (attempt >= maxRetries || !isConnReset) {
        // rethrow the error so caller sees it
        throw err;
      }
      // backoff before retrying
      const wait = 500 * Math.pow(2, attempt - 1);
      console.log(`Transient DB error detected; retrying ensureNotificationsTable in ${wait}ms (attempt ${attempt + 1}/${maxRetries})`);
      await new Promise((res) => setTimeout(res, wait));
    }
  }
}

module.exports = {
  ensureNotificationsTable,
};
