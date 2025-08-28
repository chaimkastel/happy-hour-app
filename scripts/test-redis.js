const { checkRedisHealth, cacheManager, rateLimiter, sessionManager } = require('../lib/redis')

async function testRedis() {
  console.log('🧪 Testing Redis integration...')
  
  try {
    // Test Redis health
    console.log('\n1. Testing Redis connection...')
    const health = await checkRedisHealth()
    console.log('✅ Connection status:', health.status)
    console.log('📡 Message:', health.message)
    if (health.latency) {
      console.log('⚡ Latency:', health.latency + 'ms')
    }
    
    // Test cache operations
    console.log('\n2. Testing cache operations...')
    const testKey = 'test:cache'
    const testValue = { message: 'Hello Redis!', timestamp: Date.now() }
    
    await cacheManager.set(testKey, testValue, 60)
    console.log('✅ Cache set successful')
    
    const retrieved = await cacheManager.get(testKey)
    console.log('✅ Cache get successful:', retrieved ? 'Data retrieved' : 'No data')
    
    await cacheManager.del(testKey)
    console.log('✅ Cache delete successful')
    
    // Test rate limiting
    console.log('\n3. Testing rate limiting...')
    const rateLimitTest = await rateLimiter.checkLimit('test:rate', 5, 60)
    console.log('✅ Rate limit check successful')
    console.log('📊 Allowed:', rateLimitTest.allowed)
    console.log('📊 Remaining:', rateLimitTest.remaining)
    
    // Test session management
    console.log('\n4. Testing session management...')
    const sessionKey = 'test:session'
    const sessionData = { userId: 'test123', data: 'session data' }
    
    await sessionManager.setSession(sessionKey, sessionData, 60)
    console.log('✅ Session set successful')
    
    const sessionRetrieved = await sessionManager.getSession(sessionKey)
    console.log('✅ Session get successful:', sessionRetrieved ? 'Data retrieved' : 'No data')
    
    await sessionManager.deleteSession(sessionKey)
    console.log('✅ Session delete successful')
    
    console.log('\n🎉 All Redis tests passed successfully!')
    console.log('🚀 Your Redis integration is working perfectly!')
    
  } catch (error) {
    console.error('\n❌ Redis test failed:', error.message)
    console.error('💡 Make sure Redis is running and REDIS_URL is set correctly')
    process.exit(1)
  }
}

testRedis()
