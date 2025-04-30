const client = require('prom-client')

// Créer un registre
const register = new client.Registry()

// Collecte automatique des métriques Node.js (RAM, CPU, etc.)
client.collectDefaultMetrics({ register })

// Histogramme pour mesurer le temps des requêtes
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Durée des requêtes HTTP en ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [50, 100, 200, 300, 500, 1000], // millisecondes
})
register.registerMetric(httpRequestDurationMicroseconds)

// Compteur pour les hits/miss cache
const cacheHits = new client.Counter({
  name: 'cache_hit_total',
  help: 'Nombre de cache HIT',
})
const cacheMisses = new client.Counter({
  name: 'cache_miss_total',
  help: 'Nombre de cache MISS',
})

register.registerMetric(cacheHits)
register.registerMetric(cacheMisses)

module.exports = {
  register,
  httpRequestDurationMicroseconds,
  cacheHits,
  cacheMisses,
}
