const { getRecommendedCities } = require('../services/neo4j.service');

exports.getRecommendations = async (req, res) => {
  const { city, k } = req.query;

  console.time('⏱️ /reco execution time');

  if (!city || !k) {
    console.timeEnd('⏱️ /reco execution time');
    return res.status(400).json({ error: 'city and k query parameters are required' });
  }

  try {
    const recommendations = await getRecommendedCities(city, k);
    console.timeEnd('⏱️ /reco execution time');
    res.status(200).json(recommendations);
  } catch (error) {
    console.timeEnd('⏱️ /reco execution time');
    res.status(500).json({ error: 'Internal Server Error' });
  }
};