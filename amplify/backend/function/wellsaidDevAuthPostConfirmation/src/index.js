const { Client } = require('pg');

exports.handler = async (event) => {
  console.log("🔔 PostConfirmation trigger invoked");
  console.log("📥 Raw event:", JSON.stringify(event, null, 2));

  const client = new Client({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: 5432,
    ssl: {
      rejectUnauthorized: false // Required for RDS self-signed certs
    }
  });

  const { sub: cognitoId, email, name } = event.request.userAttributes;

  if (!cognitoId || !email) {
    console.error("❌ Missing required Cognito user attributes:", {
      cognitoId,
      email
    });
    return event;
  }

  console.log("✅ Parsed Cognito attributes:", { cognitoId, email, name });

  try {
    console.log("🔗 Connecting to PostgreSQL...");
    await client.connect();
    console.log("✅ Connected to database");

    const query = `
      INSERT INTO users ("cognitoId", "email", "name", "avatar", "weeklyGoal", "cognitoActive")
      VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT ("cognitoId") DO UPDATE
        SET "email" = EXCLUDED.email,
            "name" = EXCLUDED.name,
            "avatar" = EXCLUDED.avatar,
            "weeklyGoal" = EXCLUDED."weeklyGoal",
            "cognitoActive" = true;
    `;

    const avatar = name ? name.trim().charAt(0).toUpperCase() : null;
    const weeklyGoal = 5;
    const values = [cognitoId, email, name || null, avatar, weeklyGoal];
    const result = await client.query(query, values);

    console.log("📝 Query executed successfully");
    console.log("📄 Query details:", { query, values });

  } catch (err) {
    console.error("❌ Database sync error:", {
      message: err.message,
      stack: err.stack
    });
    throw err; // rethrow to help Cognito know it failed
  } finally {
    await client.end();
    console.log("🔌 Disconnected from PostgreSQL");
  }

  return event;
};
