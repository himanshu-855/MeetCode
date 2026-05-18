import { config } from 'dotenv';
config({ path: '.env.local' });
import pg from 'pg';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  const problem1 = await prisma.problem.upsert({
    where: { slug: 'maximum-element-from-an-array' },
    update: {},
    create: {
      slug: 'maximum-element-from-an-array',
      title: 'Maximum Element From an Array',
      description: 'Given an array of integers, return the maximum element present in the array.\n\n**Input Format:**\n- First line contains integer n\n- Second line contains n space separated integers\n\n**Output Format:**\n- Print the maximum element.',
      difficulty: 'EASY',
      constraints: [
        '1 <= n <= 100000',
        '-10^9 <= arr[i] <= 10^9'
      ],
      testcases: {
        create: [
          { input: '5\n1 7 3 9 2', output: '9', isHidden: false },
          { input: '3\n-5 -1 -10', output: '-1', isHidden: false },
          { input: '1\n42', output: '42', isHidden: true },
          { input: '10\n10 9 8 7 6 5 4 3 2 1', output: '10', isHidden: true },
        ]
      }
    }
  });

  const problem2 = await prisma.problem.upsert({
    where: { slug: 'two-sum' },
    update: {},
    create: {
      slug: 'two-sum',
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\n**Input Format:**\n- First line contains integer n\n- Second line contains n space separated integers\n- Third line contains integer target\n\n**Output Format:**\n- Print the two space-separated indices.',
      difficulty: 'EASY',
      constraints: [
        '2 <= nums.length <= 10^4',
        '-10^9 <= nums[i] <= 10^9',
        '-10^9 <= target <= 10^9'
      ],
      testcases: {
        create: [
          { input: '4\n2 7 11 15\n9', output: '0 1', isHidden: false },
          { input: '3\n3 2 4\n6', output: '1 2', isHidden: false },
          { input: '2\n3 3\n6', output: '0 1', isHidden: true },
        ]
      }
    }
  });

  const problem3 = await prisma.problem.upsert({
    where: { slug: 'reverse-a-string' },
    update: {},
    create: {
      slug: 'reverse-a-string',
      title: 'Reverse a String',
      description: 'Given a string, print the reverse of the string.\n\n**Input Format:**\n- A single line containing a string\n\n**Output Format:**\n- Print the reversed string.',
      difficulty: 'EASY',
      constraints: [
        '1 <= |s| <= 10^5',
        's contains only printable ASCII characters'
      ],
      testcases: {
        create: [
          { input: 'hello', output: 'olleh', isHidden: false },
          { input: 'abcde', output: 'edcba', isHidden: false },
          { input: 'racecar', output: 'racecar', isHidden: true },
          { input: 'OpenAI', output: 'IAnepO', isHidden: true },
        ]
      }
    }
  });

  const problem4 = await prisma.problem.upsert({
    where: { slug: 'fibonacci-number' },
    update: {},
    create: {
      slug: 'fibonacci-number',
      title: 'Fibonacci Number',
      description: 'Given n, compute the nth Fibonacci number. F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).\n\n**Input Format:**\n- A single integer n\n\n**Output Format:**\n- Print the nth Fibonacci number.',
      difficulty: 'EASY',
      constraints: ['0 <= n <= 30'],
      testcases: {
        create: [
          { input: '0', output: '0', isHidden: false },
          { input: '1', output: '1', isHidden: false },
          { input: '10', output: '55', isHidden: true },
          { input: '20', output: '6765', isHidden: true },
        ]
      }
    }
  });

  const problem5 = await prisma.problem.upsert({
    where: { slug: 'longest-common-prefix' },
    update: {},
    create: {
      slug: 'longest-common-prefix',
      title: 'Longest Common Prefix',
      description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".\n\n**Input Format:**\n- First line contains n\n- Next n lines contain the strings\n\n**Output Format:**\n- Print the longest common prefix, or an empty line if none.',
      difficulty: 'MEDIUM',
      constraints: [
        '1 <= strs.length <= 200',
        '0 <= strs[i].length <= 200',
        'strs[i] consists of only lowercase English letters'
      ],
      testcases: {
        create: [
          { input: '3\nflower\nflow\nflight', output: 'fl', isHidden: false },
          { input: '3\ndog\nracecar\ncar', output: '', isHidden: false },
          { input: '1\nabc', output: 'abc', isHidden: true },
          { input: '2\ninterspecies\ninterstellar', output: 'inters', isHidden: true },
        ]
      }
    }
  });

  const problem6 = await prisma.problem.upsert({
    where: { slug: 'valid-parentheses' },
    update: {},
    create: {
      slug: 'valid-parentheses',
      title: 'Valid Parentheses',
      description: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.\n\n**Rules:**\n- Open brackets must be closed by the same type of brackets.\n- Open brackets must be closed in the correct order.\n\n**Input Format:**\n- A single string s\n\n**Output Format:**\n- Print "true" if valid, "false" otherwise.',
      difficulty: 'MEDIUM',
      constraints: [
        '1 <= s.length <= 10^4',
        's consists of parentheses only'
      ],
      testcases: {
        create: [
          { input: '()', output: 'true', isHidden: false },
          { input: '()[]{', output: 'false', isHidden: false },
          { input: '{[]}', output: 'true', isHidden: true },
          { input: '([)]', output: 'false', isHidden: true },
        ]
      }
    }
  });

  const problem7 = await prisma.problem.upsert({
    where: { slug: 'climbing-stairs' },
    update: {},
    create: {
      slug: 'climbing-stairs',
      title: 'Climbing Stairs',
      description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?\n\n**Input Format:**\n- A single integer n\n\n**Output Format:**\n- Print the number of distinct ways.',
      difficulty: 'MEDIUM',
      constraints: ['1 <= n <= 45'],
      testcases: {
        create: [
          { input: '2', output: '2', isHidden: false },
          { input: '3', output: '3', isHidden: false },
          { input: '10', output: '89', isHidden: true },
          { input: '45', output: '1836311903', isHidden: true },
        ]
      }
    }
  });

  const problem8 = await prisma.problem.upsert({
    where: { slug: 'binary-search' },
    update: {},
    create: {
      slug: 'binary-search',
      title: 'Binary Search',
      description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return -1.\n\n**Input Format:**\n- First line contains integer n\n- Second line contains n sorted integers\n- Third line contains the target\n\n**Output Format:**\n- Print the index, or -1 if not found.',
      difficulty: 'HARD',
      constraints: [
        '1 <= nums.length <= 10^4',
        '-10^4 < nums[i], target < 10^4',
        'All integers in nums are unique',
        'nums is sorted in ascending order'
      ],
      testcases: {
        create: [
          { input: '6\n-1 0 3 5 9 12\n9', output: '4', isHidden: false },
          { input: '6\n-1 0 3 5 9 12\n2', output: '-1', isHidden: false },
          { input: '1\n5\n5', output: '0', isHidden: true },
          { input: '5\n1 3 5 7 9\n7', output: '3', isHidden: true },
        ]
      }
    }
  });

  console.log('Seeded Problems:');
  [problem1, problem2, problem3, problem4, problem5, problem6, problem7, problem8].forEach(p => {
    console.log(`  ✓ ${p.title} (${p.difficulty})`);
  });
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
