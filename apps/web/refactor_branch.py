import re

with open('/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.tsx', 'r') as f:
    lines = f.readlines()

# Find the start and end of the child mapping
start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'return (' in line and 'id={`leaf-${child.id}`}' in lines[i+1]:
        start_idx = i
    if '});' in line and start_idx != -1 and end_idx == -1 and i > start_idx + 100:
        end_idx = i

if start_idx != -1 and end_idx != -1:
    extracted_lines = lines[start_idx:end_idx]
    
    # Create the function
    func_lines = ["  const renderActionCard = (child: any) => {\n", "    const isExpandedLeaf = expandedLeafId === child.id;\n"]
    for l in extracted_lines:
        func_lines.append("  " + l)
    func_lines.append("  };\n\n")
    
    # Add milestone badge logic inside the extracted lines
    for i, l in enumerate(func_lines):
        if '{child.name}' in l:
            # The next line is </p>, the line after is </div>
            func_lines.insert(i+2, "                                    {child.type === 'milestone' && (\n                                      <span className=\"shrink-0 text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md ml-2\">Hito</span>\n                                    )}\n")
            break
            
    # Find where to insert the function (before the return)
    return_idx = -1
    for i, line in enumerate(lines):
        if 'return (' in line and '<div' in lines[i+1] and 'className={`fixed inset-x-0 bottom-0' in lines[i+2]:
            return_idx = i
            break
            
    if return_idx != -1:
        lines = lines[:return_idx] + func_lines + lines[return_idx:]
        
        # Now replace the original mapping body with the function call
        # We need to re-find the new indices because we inserted lines
        new_start_idx = -1
        new_end_idx = -1
        for i, line in enumerate(lines):
            if 'const isExpandedLeaf = expandedLeafId === child.id;' in line and 'return renderActionCard(child)' not in lines[i+1]:
                # Wait, this matches inside our newly inserted function too.
                # Let's search for the one inside the `phases.map`
                if 'children.map(child => {' in lines[i-1]:
                    new_start_idx = i
                    break
        
        if new_start_idx != -1:
            # Find the closing '})' for children.map
            for i in range(new_start_idx, len(lines)):
                if '})' in lines[i] and ':' in lines[i+1] and '<p className="text-xs' in lines[i+2]:
                    new_end_idx = i
                    break
            
            if new_end_idx != -1:
                replacement = ["                              return renderActionCard(child);\n"]
                lines = lines[:new_start_idx] + replacement + lines[new_end_idx:]

        # Now insert the leavesByPhase['root'] section
        for i, line in enumerate(lines):
            if '</section>' in line and '</div>' in lines[i+1] and '{/* Footer Area */}' in lines[i+3]:
                # Found the end of the phases section
                root_section = [
                    "\n",
                    "          {/* Independent Actions & Milestones */}\n",
                    "          {leavesByPhase['root'] && leavesByPhase['root'].length > 0 && (\n",
                    "            <section className=\"space-y-3 mt-8 pt-6 border-t border-slate-100\">\n",
                    "              <div className=\"flex items-center justify-between mb-3 sm:mb-4\">\n",
                    "                <p className=\"text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest\">Hitos y Tareas Sueltas</p>\n",
                    "              </div>\n",
                    "              <div className=\"space-y-3\">\n",
                    "                {leavesByPhase['root'].map(child => renderActionCard(child))}\n",
                    "              </div>\n",
                    "            </section>\n",
                    "          )}\n"
                ]
                lines = lines[:i+1] + root_section + lines[i+1:]
                break

        with open('/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.tsx', 'w') as f:
            f.writelines(lines)
        print("Successfully refactored BranchDetailView.tsx!")
    else:
        print("Could not find return statement")
else:
    print("Could not find child mapping block")

