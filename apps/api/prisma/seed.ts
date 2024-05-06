import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  await prisma.organization.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await hash("123456", 1);

  const users = [
    {
      name: "John Doe",
      email: "john.doe@acme.com",
      avatarUrl: "https://github.com/lanprd.png",
      passwordHash: passwordHash
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash: passwordHash
    },
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatarUrl: faker.image.avatarGitHub(),
      passwordHash: passwordHash
    }
  ];

  const [user1, user2, user3] = await prisma.$transaction(users.map(user => prisma.user.create({ data: user })));

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Admin)",
      domain: "acme.com",
      slug: "acme-admin",
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUserByDomain: true,
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            }
          ]
        }
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: "ADMIN" },
            { userId: user2.id, role: "MEMBER" },
            { userId: user3.id, role: "MEMBER" }
          ]
        }
      }
    }
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Member)",
      slug: "acme-member",
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            }
          ]
        }
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: "MEMBER" },
            { userId: user2.id, role: "ADMIN" },
            { userId: user3.id, role: "MEMBER" }
          ]
        }
      }
    }
  });

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Billing)",
      slug: "acme-billing",
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user1.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            },
            {
              name: faker.lorem.words(5),
              slug: faker.lorem.words(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([user1.id, user2.id, user3.id])
            }
          ]
        }
      },
      members: {
        createMany: {
          data: [
            { userId: user1.id, role: "BILLING" },
            { userId: user2.id, role: "ADMIN" },
            { userId: user3.id, role: "MEMBER" }
          ]
        }
      }
    }
  });
}

seed().then(() => console.log("Database seeded!"));
