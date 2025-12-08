import React from 'react';
import clientPromise from '@/lib/mongodb';
import RankingBoard from '@/components/RankingBoard';

export const dynamic = 'force-dynamic';

export default async function RankingPage() {
    let rankingData: any[] = [];

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || 'neighborhood_on');
        const usersCollection = db.collection('users');

        // Aggregation Pipeline
        const pipeline = [
            // 1. Filter out users with no location
            {
                $match: {
                    location: { $exists: true, $nin: [null, ""] }
                }
            },
            // 2. Group by location
            {
                $group: {
                    _id: "$location",
                    totalScore: { $sum: "$point" },
                    participants: { $sum: 1 }
                }
            },
            // 3. Sort by totalScore descending
            { $sort: { totalScore: -1 } },
            // 4. Limit to top 20 (we show top 10 but fetch margin)
            { $limit: 20 }
        ];

        const aggregatedResults = await usersCollection.aggregate(pipeline).toArray();

        // Transform to match RankingBoard interface
        rankingData = aggregatedResults.map((item, index) => ({
            rank: index + 1,
            neighborhood: item._id, // Grouping key defaults to _id
            score: item.totalScore,
            change: 'same',
            participants: item.participants,
        }));

        // Fallback for empty data (Optional: remove this if actual data exists)
        if (rankingData.length === 0) {
            // We keep it empty and let the UI handle it or show "No data yet"
            // Or we could inject the dummy data here if we wanted to gracefully fail, 
            // but the user asked for REAL DB data.
        }

    } catch (error) {
        console.error("Failed to fetch ranking data:", error);
        // Error handling?
    }

    return (
        <RankingBoard data={rankingData} />
    );
}
