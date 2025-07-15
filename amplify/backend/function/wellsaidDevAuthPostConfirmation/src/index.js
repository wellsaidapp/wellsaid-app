const { Client } = require('pg');
const AWS = require('aws-sdk');

// Initialize S3 client
const s3 = new AWS.S3();

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

    // Create user record
    const query = `
      INSERT INTO users ("cognitoId", "email", "name", "avatar", "weeklyGoal", "cognitoActive", "s3FolderCreated", "s3FolderType")
      VALUES ($1, $2, $3, $4, $5, true, true, 'active')
      ON CONFLICT ("cognitoId") DO UPDATE
        SET "email" = EXCLUDED.email,
            "name" = EXCLUDED.name,
            "avatar" = EXCLUDED.avatar,
            "weeklyGoal" = EXCLUDED."weeklyGoal",
            "cognitoActive" = true,
            "s3FolderCreated" = true,
            "s3FolderType" = 'active';
    `;

    const avatar = name ? name.trim().charAt(0).toUpperCase() : null;
    const weeklyGoal = 5;
    const values = [cognitoId, email, name || null, avatar, weeklyGoal];
    await client.query(query, values);
    console.log("📝 User record inserted/updated");

    // Create S3 folders
    const bucket = process.env.S3_BUCKET_NAME;
    const folders = [
      `Users/Active/${cognitoId}/images/`,
      `Users/Active/${cognitoId}/books/`
    ];

    console.log(`🪣 Bucket name: ${bucket}`);
    console.log(`📂 Folder keys:`, folders);

    // Add this BEFORE the actual S3 call
    console.log("🚀 Starting S3 folder creation...");

    const createFolderPromises = folders.map((folderKey) => {
      console.log(`🛠 Creating S3 folder: ${folderKey}`);
      return s3.putObject({
        Bucket: bucket,
        Key: folderKey,
        Body: ''
      }).promise();
    });

    await Promise.all(createFolderPromises);

    console.log("✅ All folders created successfully.");

  } catch (err) {
    console.error("❌ Error in PostConfirmation Lambda:", {
      message: err.message,
      stack: err.stack
    });
    throw err;
  } finally {
    await client.end();
    console.log("🔌 Disconnected from PostgreSQL");
  }

  return event;
};
