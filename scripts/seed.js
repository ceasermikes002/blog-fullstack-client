const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.post.createMany({
    data: [
      {
        title: 'First Post',
        content: 'This is the content of the first post.',
        slug: 'first-post',
        featuredImage: 'https://via.placeholder.com/150',
        draft: false,
      },
      {
        title: 'Second Post',
        content: 'This is the content of the second post.',
        slug: 'second-post',
        featuredImage: 'https://via.placeholder.com/150',
        draft: false,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
