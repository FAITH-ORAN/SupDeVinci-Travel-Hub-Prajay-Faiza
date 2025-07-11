const getNeo4jSession = require('../config/neo4j.config');

exports.getRecommendedCities = async (city, k) => {
  const session = getNeo4jSession();
  const kInt = Math.floor(Number(k)) || 3;

  const cypherQuery = `
  MATCH (c:City {code: $city})-[r:NEAR]->(n:City)
  RETURN n.code AS city, r.weight AS score
  ORDER BY r.weight DESC
  LIMIT ${kInt}
`;

  const params = { city };

  console.log('🔵 Running Cypher Query:', cypherQuery.trim());
  console.log('🔵 With Parameters:', params);

  try {
    const result = await session.run(cypherQuery, params);
    return result.records.map(record => ({
      city: record.get('city'),
      score: record.get('score')
    }));
  } catch (error) {
    console.error('❌ Error executing Neo4j query:', error.message);
    throw error;
  } finally {
    await session.close();
  }
};

exports.getNearbyCityCodes = async (cityCode, limit = 3) => {
  const session = getNeo4jSession();
  const intLimit = Math.floor(Number(limit)) || 3;

  const query = `
    MATCH (c:City {code: $city})-[r:NEAR]->(n:City)
    RETURN n.code AS code
    ORDER BY r.weight DESC
    LIMIT ${intLimit}
  `;

  try {
    const result = await session.run(query, { city: cityCode });
    return result.records.map(record => record.get('code'));
  } catch (err) {
    console.error('❌ Neo4j getNearbyCityCodes error:', err.message);
    return [];
  } finally {
    await session.close();
  }
};