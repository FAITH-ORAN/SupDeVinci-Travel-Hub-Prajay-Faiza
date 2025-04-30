const neo4j = require('neo4j-driver')

const driver = neo4j.driver(
  'neo4j+s://4d9aea4e.databases.neo4j.io',
  neo4j.auth.basic('neo4j', '2jvOX_s-So_YUEymIG7WNUa_xvmS2S8RlPtmU03ie2I')
)

const getNeo4jSession = () => driver.session()

const testNeo4jConnection = async () => {
  try {
    const session = getNeo4jSession()
    await session.run('RETURN 1')
    console.log('✅ Connected to Neo4j Aura')
    await session.close()
  } catch (err) {
    console.error('❌ Neo4j connection failed:', err.message)
  }
}

testNeo4jConnection()

module.exports = getNeo4jSession
