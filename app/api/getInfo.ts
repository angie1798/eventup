import connectionPool from '../../db';


export default async function handler(req, res) {
  try {
    const client = await connectionPool.connect();
    const result = await client.query('SELECT * FROM events');
    const events = result.rows;
    client.release();
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}