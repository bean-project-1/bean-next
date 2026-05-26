import os
import glob
import re

files = glob.glob('/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/app/api/**/*.ts', recursive=True)

for file in files:
    if 'logout/route.ts' in file:
        continue
        
    with open(file, 'r') as f:
        content = f.read()
        
    if 'bean_user_id' not in content:
        continue

    print(f"Processing {file}")

    # Add import { auth } from '@/auth';
    if "import { auth } from '@/auth';" not in content:
        content = re.sub(r"(import .*;\n)", r"\1import { auth } from '@/auth';\n", content, count=1)

    # 1. Replace the big dev fallback pattern used in schedule/route, actions/[id]/route, life-tree/route
    fallback_pattern = r"let\s+userId\s*=\s*req\.cookies\.get\('bean_user_id'\)\?\.value;[\s\S]*?(?:if\s*\(\!userId\)\s*\{\s*return\s*NextResponse\.json\([^;]+;\s*\})"
    
    replacement_auth = """const session = await auth();
    let userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }"""
    
    content = re.sub(fallback_pattern, replacement_auth, content)

    # 2. Replace simple let/const userId = req.cookies.get('bean_user_id')?.value;
    simple_pattern = r"(const|let)\s+userId\s*=\s*req\.cookies\.get\('bean_user_id'\)\?\.value;"
    simple_repl = r"const session = await auth();\n    \1 userId = session?.user?.id;"
    content = re.sub(simple_pattern, simple_repl, content)

    # 3. Clean up goal-generate fallback (since goal-generate used const userId = cookies...)
    goal_gen_pattern = r"// 1\. Resolve User\s*let\s*user\s*=\s*null;\s*if\s*\(userId\)\s*\{\s*user\s*=\s*await\s*prisma\.user\.findUnique\(\{\s*where:\s*\{\s*id:\s*userId\s*\}\s*\}\);\s*\}\s*if\s*\(!user\)\s*\{\s*user\s*=\s*await\s*prisma\.user\.findFirst\(\);\s*userId\s*=\s*user\?\.id;\s*\}"
    goal_gen_repl = r"// 1. Resolve User\n    let user = await prisma.user.findUnique({ where: { id: userId } });"
    content = re.sub(goal_gen_pattern, goal_gen_repl, content)
    
    # 4. Clean up goal-coach fallback
    goal_coach_pattern = r"let\s*user\s*=\s*null;\s*if\s*\(userId\)\s*\{\s*user\s*=\s*await\s*prisma\.user\.findUnique\(\{\s*where:\s*\{\s*id:\s*userId\s*\}\s*\}\);\s*\}\s*if\s*\(!user\)\s*\{\s*user\s*=\s*await\s*prisma\.user\.findFirst\(\{\s*include:\s*\{\s*baseCommitments:\s*true\s*\}\s*\}\);\s*userId\s*=\s*user\?\.id;\s*\}"
    goal_coach_repl = r"const user = await prisma.user.findUnique({ where: { id: userId }, include: { baseCommitments: true } });"
    content = re.sub(goal_coach_pattern, goal_coach_repl, content)

    with open(file, 'w') as f:
        f.write(content)

print("Done refactoring auth with Python!")
