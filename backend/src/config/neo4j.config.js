const neo4j = require('neo4j-driver');
const driver = neo4j.driver(
  'neo4j+s://4d9aea4e.databases.neo4j.io',
  neo4j.auth.basic(
    'neo4j',
    '2jvOX_s-So_YUEymIG7WNUa_xvmS2S8RlPtmU03ie2I'
  )
);

const getNeo4jSession = () => driver.session();

module.exports = getNeo4jSession;