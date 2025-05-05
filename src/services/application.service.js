const { PrismaClient } = require('@prisma/client');
const APPLICATION_STATUS = require('../constants/application');
const USER_ROLES = require('../constants/roles');

const prisma = new PrismaClient();

const createApplication = async (jobId, userId) => {
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { userId }
    });

    if (!candidate) {
      throw new Error('Please complete your candidate profile first');
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      throw new Error('Job not found');
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        candidateId: candidate.id
      }
    });

    if (existingApplication) {
      throw new Error('You have already applied for this job');
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        candidateId: candidate.id,
        status: APPLICATION_STATUS.APPLIED
      },
      include: {
        job: true,
        candidate: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    return application;
  } catch (error) {
    throw error;
  }
};

const updateApplicationStatus = async (applicationId, status) => {
  try {
    const id = parseInt(applicationId);
    if (isNaN(id)) {
      throw new Error('Invalid application ID');
    }

    const application = await prisma.application.findUnique({
      where: { id }
    });

    if (!application) {
      throw new Error('Application not found');
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: { status },
      include: {
        job: true,
        candidate: {
          include: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    return updatedApplication;
  } catch (error) {
    throw error;
  }
};

const getAllApplication = async ({page, limit, job_id, status, userId, userRole}) => {
  const where = buildWhereClause({ job_id, status, userId, userRole });
  const [applications, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { appliedAt: 'desc' }
    }),
    prisma.application.count({ where })
  ]);
  return {
    applications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

const buildWhereClause = ({ job_id, status, userId, userRole }) => {
  const filter = [];
  if (job_id) {
    filter.push({ jobId: parseInt(job_id) });
  }

  if (status) {
    filter.push({ status });
  }

  if (userRole === USER_ROLES.ADMIN) {
    return filter.length ? { AND: filter } : {};
  }

  if (userRole === USER_ROLES.CANDIDATE) {
    filter.push({
      candidate: {
        userId
      }
    });
  }

  return filter.length ? { AND: filter } : {};
}

module.exports = {
  createApplication,
  updateApplicationStatus,
  getAllApplication
}; 