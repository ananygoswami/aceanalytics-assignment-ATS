const { PrismaClient } = require('@prisma/client');
const redisClient = require('../utils/redis');

const CACHE_TTL_SECONDS = 300;
const JOBS_CACHE_VERSION_KEY = 'jobs_cache_version';

const prisma = new PrismaClient();

const incrementJobsCacheVersion = async () => {
  if (redisClient) {
    try {
      await redisClient.setnx(JOBS_CACHE_VERSION_KEY, 0);
      await redisClient.incr(JOBS_CACHE_VERSION_KEY);
      console.log('Incremented jobs cache version.');
    } catch (error) {
      console.error('Redis error incrementing cache version:', error);
    }
  } else {
    console.warn('Redis client not available, skipping cache version increment.');
  }
};

const createJob = async (data) => {
  const job = await prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      salaryRange: data.salaryRange
    }
  });
  await incrementJobsCacheVersion();

  return job;
};


const getJobById = async (id) => {
  const job = await prisma.job.findUnique({
    where: { id: parseInt(id) }
  });

  if (!job) {
    throw new Error('Job not found');
  }

  return job;
};


const getAllJobs = async ({ page = 1, limit = 10, search, location }) => {
  page = parseInt(page, 10) || 1;
  limit = parseInt(limit, 10) || 10;

  let cacheVersion = 0;
  let cacheKey = null;
  if (redisClient) {
    try {
      const versionStr = await redisClient.get(JOBS_CACHE_VERSION_KEY);
      if (versionStr === null) {
        await redisClient.set(JOBS_CACHE_VERSION_KEY, 0);
        cacheVersion = 0;
      } else {
        cacheVersion = parseInt(versionStr, 10);
      }

      const safeSearch = search || 'all';
      const safeLocation = location || 'all';
      cacheKey = `jobs:v${cacheVersion}:page=${page}:limit=${limit}:search=${safeSearch}:location=${safeLocation}`;

      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        console.log(`Cache hit for key: ${cacheKey}`);
        console.log('we returning from redis ');
        return JSON.parse(cachedData);
      }
      console.log(`Cache miss for key: ${cacheKey}`);
    } catch (error) {
      console.error(`Redis GET/Version error for key ${cacheKey || 'version key'}:`, error);
      cacheKey = null; 
    }
  } else {
      console.warn('Redis client not available, skipping cache check.');
  }

  const where = {};
  const filterConditions = [];
  if (search) {
    filterConditions.push({
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    });
  }
  if (location) {
    filterConditions.push({
      location: { contains: location, mode: 'insensitive' }
    });
  }
  if (filterConditions.length > 0) {
    where.AND = filterConditions;
  }

  try {
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    const result = {
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };

    if (redisClient && cacheKey) {
      try {
        await redisClient.set(cacheKey, JSON.stringify(result), 'EX', CACHE_TTL_SECONDS);
        console.log(`Cache set for key: ${cacheKey} with TTL ${CACHE_TTL_SECONDS}s`);
      } catch (error) {
        console.error(`Redis SET error for key ${cacheKey}:`, error);
      }
    }

    return result;
  } catch (dbError) {
      console.error("Database query failed:", dbError);
      throw new Error("Failed to retrieve jobs from the database.");
  }
};

module.exports = {
  createJob,
  getJobById,
  getAllJobs
}; 