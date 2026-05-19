import { config } from 'dotenv';
config({ path: '.env.local', override: true });
import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🚀 Starting Scalable Seed System...');

  // 1. Ingest Topics
  console.log('📂 Ingesting Topics...');
  const topicsPath = path.join(__dirname, 'data/topics');
  const topicFiles = fs.readdirSync(topicsPath);
  
  for (const file of topicFiles) {
    if (!file.endsWith('.json')) continue;
    const topics = JSON.parse(fs.readFileSync(path.join(topicsPath, file), 'utf-8'));
    for (const topicData of topics) {
      await prisma.topic.upsert({
        where: { slug: topicData.slug },
        update: { name: topicData.name },
        create: { name: topicData.name, slug: topicData.slug }
      });
    }
  }
  console.log('✅ Topics ingested.');

  // 2. Ingest Problems
  console.log('📂 Ingesting Problems...');
  const problemsPath = path.join(__dirname, 'data/problems');
  const problemFiles = fs.readdirSync(problemsPath);
  
  for (const file of problemFiles) {
    if (!file.endsWith('.json')) continue;
    const problems = JSON.parse(fs.readFileSync(path.join(problemsPath, file), 'utf-8'));
    for (const p of problems) {
      const problem = await prisma.problem.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          constraints: p.constraints,
          estimatedTime: p.estimatedTime,
          starterCode: p.starterCode,
          companyRelevance: p.companyRelevance || [],
        },
        create: {
          slug: p.slug,
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          constraints: p.constraints,
          estimatedTime: p.estimatedTime,
          starterCode: p.starterCode,
          companyRelevance: p.companyRelevance || [],
          testcases: {
            create: p.testcases
          }
        }
      });

      // Link topics
      if (p.topics) {
        for (const topicSlug of p.topics) {
          const topic = await prisma.topic.findUnique({ where: { slug: topicSlug } });
          if (topic) {
            await prisma.problemTopic.upsert({
              where: {
                problemId_topicId: {
                  problemId: problem.id,
                  topicId: topic.id
                }
              },
              update: {},
              create: {
                problemId: problem.id,
                topicId: topic.id
              }
            });
          }
        }
      }
      console.log(`  ✓ ${p.title}`);
    }
  }
  console.log('✅ Problems ingested.');

  // 3. Ingest Tracks
  console.log('📂 Ingesting Tracks...');
  const tracksPath = path.join(__dirname, 'data/tracks');
  const trackFiles = fs.readdirSync(tracksPath);
  
  for (const file of trackFiles) {
    if (!file.endsWith('.json')) continue;
    const t = JSON.parse(fs.readFileSync(path.join(tracksPath, file), 'utf-8'));
    const track = await prisma.learningTrack.upsert({
      where: { slug: t.slug },
      update: {
        title: t.title,
        description: t.description,
        image: t.image,
      },
      create: {
        slug: t.slug,
        title: t.title,
        description: t.description,
        image: t.image,
      }
    });

    for (const sectionData of t.sections) {
      const section = await prisma.trackSection.upsert({
        where: { 
          id: `${track.slug}-${sectionData.title.toLowerCase().replace(/\s+/g, '-')}` 
        },
        update: {
          title: sectionData.title,
          order: sectionData.order,
        },
        create: {
          id: `${track.slug}-${sectionData.title.toLowerCase().replace(/\s+/g, '-')}`,
          trackId: track.id,
          title: sectionData.title,
          order: sectionData.order,
        }
      });

      // Add problems to section
      for (let i = 0; i < sectionData.problems.length; i++) {
        const problemSlug = sectionData.problems[i];
        const problem = await prisma.problem.findUnique({ where: { slug: problemSlug } });
        if (problem) {
          await prisma.trackProblem.upsert({
            where: {
              id: `tp-${track.slug}-${section.id}-${problem.id}`,
            },
            update: {
              order: i + 1,
            },
            create: {
              id: `tp-${track.slug}-${section.id}-${problem.id}`,
              sectionId: section.id,
              problemId: problem.id,
              order: i + 1,
            }
          });
        }
      }
    }
    console.log(`  ✓ ${t.title}`);
  }
  console.log('✅ Tracks ingested.');

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
