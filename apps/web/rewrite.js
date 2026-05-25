const fs = require('fs');
const file = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the exact block to extract
const startAnchor = '<div key={child.id} id={`leaf-${child.id}`} className="border border-slate-100 rounded-[20px] sm:rounded-3xl overflow-hidden bg-white shadow-sm transition-all duration-300">';
const endAnchor = '</div>\n                                  )}';

const startIdx = content.indexOf(startAnchor);
const endIdx = content.indexOf(endAnchor, startIdx) + endAnchor.length;

let childBlock = content.substring(startIdx, endIdx);

// Un-indent the childBlock by 32 spaces
childBlock = childBlock.split('\n').map(l => l.startsWith('                                ') ? l.substring(32) : l).join('\n');

// Add the Hito tag inside childBlock
childBlock = childBlock.replace(
    '<div className="flex-1 min-w-0">\n  <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? \'text-slate-400 line-through\' : \'text-slate-700\'}`}>\n    {child.name}\n  </p>\n</div>',
    '<div className="flex-1 min-w-0 flex items-center gap-2">\n  <p className={`text-xs sm:text-sm font-bold truncate ${child.completed ? \'text-slate-400 line-through\' : \'text-slate-700\'}`}>\n    {child.name}\n  </p>\n  {child.type === \'milestone\' && (\n    <span className="shrink-0 text-[8px] font-black uppercase tracking-widest text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">Hito</span>\n  )}\n</div>'
);

const renderFunction = `  const renderActionCard = (child: any) => {\n    const isExpandedLeaf = expandedLeafId === child.id;\n    return (\n      ${childBlock.split('\n').join('\n      ')}\n    </div>\n    );\n  };\n`;

// Insert the renderFunction at the beginning of the `BranchDetailView` function body
// BranchDetailView starts at `export function BranchDetailView({`
const branchDetailViewStart = content.indexOf('export function BranchDetailView({');
const hooksStart = content.indexOf('  const [editGoal, setEditGoal] = useState', branchDetailViewStart);

content = content.substring(0, hooksStart) + renderFunction + '\n' + content.substring(hooksStart);

// Now replace the original mapping with renderActionCard(child)
const mapStartString = 'children.map(child => {\n                              const isExpandedLeaf = expandedLeafId === child.id;\n                              \n                              return (\n                                ' + startAnchor;
const mapEndString = '                              );\n                            })';

const mapStartIdx = content.indexOf(mapStartString);
const mapEndIdx = content.indexOf(mapEndString, mapStartIdx) + mapEndString.length;

content = content.substring(0, mapStartIdx) + 'children.map(child => renderActionCard(child))' + content.substring(mapEndIdx);

// Now add the independent milestones section
const phasesEndStr = '            </div>\n          </section>';
const phasesEndIdx = content.indexOf(phasesEndStr);

const independentSection = `            </div>\n          </section>\n\n          {leavesByPhase['root'] && leavesByPhase['root'].length > 0 && (\n            <section className="space-y-3 mt-8 pt-6 border-t border-slate-100">\n              <div className="flex items-center justify-between mb-3 sm:mb-4">\n                <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Hitos y Tareas Sueltas</p>\n              </div>\n              <div className="space-y-3">\n                {leavesByPhase['root'].map(child => renderActionCard(child))}\n              </div>\n            </section>\n          )}`;

content = content.substring(0, phasesEndIdx) + independentSection + content.substring(phasesEndIdx + phasesEndStr.length);

fs.writeFileSync('/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.new.tsx', content);
console.log('Created new file');
