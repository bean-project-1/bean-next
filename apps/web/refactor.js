const fs = require('fs');
const file = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block to extract starts exactly at `<div key={child.id} id={\`leaf-\${child.id}\`}`
// and ends after the `</div>` that closes it.
// Looking at the view_file output, lines 517 to 646.

const startString = '<div key={child.id} id={`leaf-${child.id}`}';
const endString = '</div>\n                                  )}';

const startIdx = content.indexOf(startString);
const endIdx = content.indexOf(endString, startIdx) + endString.length;

if (startIdx !== -1 && endIdx !== -1) {
    let block = content.substring(startIdx, endIdx);
    
    // Add the milestone tag logic
    block = block.replace(
        '<div className="flex-1 min-w-0">\n                                      <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? \'text-slate-400 line-through\' : \'text-slate-700\'}`}>\n                                        {child.name}\n                                      </p>\n                                    </div>',
        '<div className="flex-1 min-w-0 flex items-center gap-2">\n                                      <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? \'text-slate-400 line-through\' : \'text-slate-700\'}`}>\n                                        {child.name}\n                                      </p>\n                                      {child.type === \'milestone\' && (\n                                        <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">Hito</span>\n                                      )}\n                                    </div>'
    );
    
    // Un-indent the block by 32 spaces (it was highly indented)
    const lines = block.split('\n').map(l => l.startsWith('                                ') ? l.substring(32) : l);
    
    // Create the function
    const functionDefinition = `  const renderActionCard = (child: any) => {\n    const isExpandedLeaf = expandedLeafId === child.id;\n    return (\n      ${lines.join('\n      ')}\n    </div>\n    );\n  };\n\n  return (`;
    
    // Insert function before return
    content = content.replace('  return (', functionDefinition);
    
    // Now replace the original block in the map
    const originalMapBlockStart = 'children.map(child => {\n                              const isExpandedLeaf = expandedLeafId === child.id;\n                              \n                              return (\n                                ' + startString;
    
    // Let's use regex to find the map block
    // We know it starts at "children.map(child => {" and ends at "})" before " : ("
    
    const mapRegex = /children\.map\(child => \{[\s\S]*?className="text-xs text-slate-400 italic text-center py-4">Sin actividades registradas\.<\/p>/;
    
    content = content.replace(mapRegex, `children.map(child => renderActionCard(child))\n                          ) : (\n                            <p className="text-xs text-slate-400 italic text-center py-4">Sin actividades registradas.</p>`);
    
    // Add the independent section after phases
    const phasesEndString = '            </div>\n          </section>';
    const independentSection = `            </div>\n          </section>\n\n          {leavesByPhase['root'] && leavesByPhase['root'].length > 0 && (\n            <section className="space-y-3 mt-8 pt-6 border-t border-slate-100">\n              <div className="flex items-center justify-between mb-3 sm:mb-4">\n                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Hitos y Tareas Sueltas</p>\n              </div>\n              <div className="space-y-3">\n                {leavesByPhase['root'].map(child => renderActionCard(child))}\n              </div>\n            </section>\n          )}`;
    
    content = content.replace(phasesEndString, independentSection);
    
    fs.writeFileSync(file, content);
    console.log("Success");
} else {
    console.log("Failed to find blocks");
}
