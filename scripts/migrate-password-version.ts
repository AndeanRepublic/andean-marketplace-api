/**
 * Migration Script: Add passwordVersion field to Account collection
 *
 * Purpose:
 * This script adds the passwordVersion field to all existing accounts in MongoDB.
 * The passwordVersion field is used for session invalidation when a user changes their password.
 *
 * Execution Instructions:
 * 1. Connect to your MongoDB instance
 * 2. Select the database used by the application
 * 3. Run this script using MongoDB shell or a MongoDB client
 *
 * MongoDB Shell Example:
 *   mongosh "mongodb://localhost:27017/andean-marketplace"
 *   load('scripts/migrate-password-version.ts')
 *
 * OR using Node.js:
 *   node -r ts-node/register scripts/migrate-password-version.ts
 */

import mongoose from 'mongoose';

const MONGODB_URI =
	'mongodb+srv://andean-backend:W8V3XmVxuc7nTWgQ@andean.dtotlel.mongodb.net/marketplace_prod?appName=marketplace-prod';

async function migratePasswordVersion() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log('Connected to MongoDB');

		const accountsCollection = mongoose.connection.collection('accounts');

		// Count documents that need migration
		const countWithoutField = await accountsCollection.countDocuments({
			passwordVersion: { $exists: false },
		});

		console.log(
			`Found ${countWithoutField} accounts without passwordVersion field`,
		);

		if (countWithoutField === 0) {
			console.log(
				'No accounts to migrate. All accounts already have passwordVersion field.',
			);
			return;
		}

		// Update all accounts without passwordVersion to have passwordVersion = 1
		const result = await accountsCollection.updateMany(
			{ passwordVersion: { $exists: false } },
			{ $set: { passwordVersion: 1 } },
		);

		console.log(`Migration completed successfully!`);
		console.log(`Modified ${result.modifiedCount} documents`);

		// Verify migration
		const countAfter = await accountsCollection.countDocuments({
			passwordVersion: { $exists: false },
		});

		if (countAfter === 0) {
			console.log(
				'✅ Verification passed: All accounts now have passwordVersion field',
			);
		} else {
			console.warn(
				`⚠️ Warning: ${countAfter} accounts still missing passwordVersion field`,
			);
		}
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	} finally {
		await mongoose.disconnect();
		console.log('Disconnected from MongoDB');
	}
}

// Run migration if this script is executed directly
if (require.main === module) {
	migratePasswordVersion()
		.then(() => {
			console.log('Migration script completed');
			process.exit(0);
		})
		.catch((error) => {
			console.error('Migration script failed:', error);
			process.exit(1);
		});
}

export { migratePasswordVersion };
