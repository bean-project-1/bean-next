import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

const files = globSync('/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/app/api/**/*.ts');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('bean_user_id') && !content.includes('import { auth } from \'@/auth\'')) {
    continue;
  }

  // Skip the logout route (we'll delete it later)
  if (file.includes('logout/route.ts')) continue;

  console.log('Processing', file);

  // 1. Add import { auth } from '@/auth';
  if (!content.includes(`import { auth } from '@/auth';`)) {
    content = content.replace(/(import .*;\n)/, `$1import { auth } from '@/auth';\n`);
  }

  // 2. Replace simple single-line getters: const userId = req.cookies.get('bean_user_id')?.value;
  content = content.replace(
    /const\s+userId\s*=\s*req\.cookies\.get\('bean_user_id'\)\?\.value;/g,
    `const session = await auth();\n    const userId = session?.user?.id;`
  );

  // 3. Replace the dev fallback block pattern:
  // let userId = req.cookies.get('bean_user_id')?.value;
  // let user = null;
  // if (userId) user = await prisma.user.findUnique({ where: { id: userId } });
  // if (!user) {
  //   user = await prisma.user.findFirst();
  //   userId = user?.id;
  // }
  // if (!userId) { ... }
  content = content.replace(
    /let\s+userId\s*=\s*req\.cookies\.get\('bean_user_id'\)\?\.value;[\s\S]*?(?:if\s*\(\!userId\)\s*\{\s*return\s*NextResponse\.json\([^;]+;\s*\})/g,
    `const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }`
  );

  // 4. In goal-generate it's slightly different
  content = content.replace(
    /const\s+userId\s*=\s*req\.cookies\.get\('bean_user_id'\)\?\.value;[\s\S]*?(?:if\s*\(\!userId\)\s*\{\s*return\s*NextResponse\.json\([^;]+;\s*\}\s*)(\/\/ 1\. Resolve User[\s\S]*?if\s*\(!user\)\s*\{[\s\S]*?userId\s*=\s*user\?\.id;\s*\})/g,
    `const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // 1. Resolve User
    const user = await prisma.user.findUnique({ where: { id: userId } });`
  );

  // 5. In goal-coach
  content = content.replace(
    /let\s+user\s*=\s*null;[\s\S]*?if\s*\(!user\)\s*\{[\s\S]*?userId\s*=\s*user\?\.id;\s*\}/g,
    `const user = await prisma.user.findUnique({ where: { id: userId } });`
  );

  // 6. Fix any leftover NextResponse imports if they were missing (should be fine)

  fs.writeFileSync(file, content);
}

console.log('Done refactoring auth!');
