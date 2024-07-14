import { PrismaClient } from '@prisma/client';
import { withAuth, currentUser } from '@clerk/nextjs';

const prisma = new PrismaClient();

export default withAuth(async (req, res) => {
  const user = await currentUser();

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { id, emailAddresses } = user;
  const email = emailAddresses[0].emailAddress;

  await prisma.user.upsert({
    where: { id },
    update: { email },
    create: { id, email},
  });

  res.status(200).json({ message: 'User synchronized' });
});
