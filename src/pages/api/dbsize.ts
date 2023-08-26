import { FirestoreCache } from '@/services/firestore';
import { NextApiHandler } from 'next';

const cache = new FirestoreCache();

const handler: NextApiHandler = async (req, res) => {
	try {
		const size = await cache.getDbSize();
		res.status(200).json({ size });
	} catch (err: any) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
};

export default handler;
