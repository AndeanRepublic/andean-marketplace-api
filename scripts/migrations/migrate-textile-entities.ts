/**
 * Migration: Textile product entities refactor
 *
 * 1. Add currency: 'USD' to priceInventary where missing
 * 2. Rename detailTraceability.isBackorderAvailable -> availableUponRequest
 * 3. Transform detailTraceability.certificationId (string) -> certificationIds (array)
 *
 * Run: npx ts-node -r tsconfig-paths/register scripts/migrations/migrate-textile-entities.ts
 */

import * as mongoose from 'mongoose';

const MONGO_URI =
	process.env.MONGO_URI || 'mongodb://localhost:27017/andean-marketplace';

async function migrate() {
	console.log('Connecting to MongoDB...');
	await mongoose.connect(MONGO_URI);

	const db = mongoose.connection.db;
	if (!db) {
		throw new Error('Database connection failed');
	}

	const collection = db.collection('textileproducts');

	// 1. Add currency: 'USD' where priceInventary exists but currency is missing
	const withoutCurrency = await collection.updateMany(
		{
			priceInventary: { $exists: true },
			$or: [
				{ 'priceInventary.currency': { $exists: false } },
				{ 'priceInventary.currency': null },
			],
		},
		{ $set: { 'priceInventary.currency': 'USD' } },
	);
	console.log(
		`[1] Added currency USD: ${withoutCurrency.modifiedCount} products`,
	);

	// 2. Rename isBackorderAvailable -> availableUponRequest
	const toRenameBackorder = await collection.updateMany(
		{ 'detailTraceability.isBackorderAvailable': { $exists: true } },
		{
			$rename: {
				'detailTraceability.isBackorderAvailable':
					'detailTraceability.availableUponRequest',
			},
		},
	);
	console.log(
		`[2] Renamed isBackorderAvailable -> availableUponRequest: ${toRenameBackorder.modifiedCount} products`,
	);

	// 3. Transform certificationId (string) -> certificationIds (array) and remove certificationId
	const withCertId = await collection
		.find({
			'detailTraceability.certificationId': { $exists: true, $ne: null },
		})
		.toArray();

	for (const doc of withCertId) {
		const certId = (doc.detailTraceability as Record<string, unknown>)
			?.certificationId;
		if (certId !== undefined && certId !== null) {
			const arr = Array.isArray(certId) ? certId : [certId];
			await collection.updateOne(
				{ _id: doc._id },
				{
					$set: { 'detailTraceability.certificationIds': arr },
					$unset: { 'detailTraceability.certificationId': '' },
				},
			);
		}
	}
	console.log(
		`[3] Migrated certificationId -> certificationIds: ${withCertId.length} products`,
	);

	console.log('Migration completed successfully.');
}

migrate()
	.catch((err) => {
		console.error('Migration failed:', err);
		process.exit(1);
	})
	.finally(() => {
		mongoose.disconnect();
	});
