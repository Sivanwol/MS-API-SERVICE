import Redis from 'ioredis';
import util from 'util';

class RedisUtil {

  // if redis url is specified use that one, otherwise separate definitions
  readonly redisConnection = { url: process.env.REDIS_URL};
  readonly client = new Redis( process.env.REDIS_URL );
  readonly del = util.promisify( this.client.del ).bind( this.client );
  readonly get = util.promisify( this.client.get ).bind( this.client );
  readonly hmset = util.promisify( this.client.hmset ).bind( this.client );
  readonly hgetall = util.promisify( this.client.hgetall ).bind( this.client );
  readonly expire = util.promisify( this.client.expire ).bind( this.client );
  readonly smembers = util.promisify( this.client.smembers ).bind( this.client );
  readonly sadd = util.promisify( this.client.sadd ).bind( this.client );
  readonly srem = util.promisify( this.client.srem ).bind( this.client );
  readonly sismember = util.promisify( this.client.sismember ).bind( this.client );
  readonly scard = util.promisify( this.client.scard ).bind( this.client );
  readonly keys = util.promisify( this.client.keys ).bind( this.client );
  readonly exists = util.promisify( this.client.exists ).bind( this.client );
  readonly exec = util.promisify( this.client.exec ).bind( this.client );

  public batch() {
    const batch = this.client.multi();
    return {
      del: util.promisify( batch.del ).bind( batch ),
      get: util.promisify( batch.get ).bind( batch ),
      set: util.promisify( batch.set ).bind( batch ),
      hmset: util.promisify( batch.hmset ).bind( batch ),
      hgetall: util.promisify( batch.hgetall ).bind( batch ),
      expire: util.promisify( batch.expire ).bind( batch ),
      smembers: util.promisify( batch.smembers ).bind( batch ),
      sadd: util.promisify( batch.sadd ).bind( batch ),
      srem: util.promisify( batch.srem ).bind( batch ),
      sismember: util.promisify( batch.sismember ).bind( batch ),
      scard: util.promisify( batch.scard ).bind( batch ),
      keys: util.promisify( batch.keys ).bind( batch ),
      exists: util.promisify( batch.exists ).bind( batch ),
    }
  }
}

export default new RedisUtil();
