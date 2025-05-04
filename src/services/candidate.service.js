const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerCandidate = async (userId, data) => {
  try {
    const { fullName, phone, resumeUrl } = data;

    if (!userId) {
      throw new Error('User ID is required');
    }

    const existingCandidate = await prisma.candidate.findUnique({
      where: {
        userId: parseInt(userId)
      }
    });

    if (existingCandidate) {
      throw new Error('Candidate profile already exists');
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const candidate = await prisma.candidate.create({
      data: {
        userId: parseInt(userId),
        fullName,
        phone,
        resumeUrl
      },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    return candidate;
  } catch (error) {
    console.error('Error in registerCandidate:', error);
    throw error;
  }
};

module.exports = {
  registerCandidate
}; 