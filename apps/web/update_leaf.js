const fs = require('fs');
const file = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/Leaf.tsx';
let content = fs.readFileSync(file, 'utf8');

const leafStart = `<defs>
          <linearGradient id={\`leafGrad-\${leaf.id}\`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>
        </defs>`;

const leafEnd = `          <path d="M 8.75,0 C 9.5,-1.25 11.25,-1.5 12.5,-2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
          <path d="M 8.75,0 C 9.5,1.25 11.25,1.5 12.5,2" stroke={leaf.completed ? "#15803d" : "#cbd5e1"} strokeWidth="0.2" fill="none" />
        </g>`;

// First, find the chunk to replace
const startIndex = content.indexOf('<defs>');
const endIndex = content.indexOf('</g>\n      </g>\n    </g>\n  );');
if (startIndex === -1 || endIndex === -1) {
  console.log('Could not find anchors');
  process.exit(1);
}

const originalBody = content.substring(startIndex, endIndex);

const newBody = `{leaf.type === 'milestone' ? (
          <>
            <defs>
              <linearGradient id={\`fruitGrad-\${leaf.id}\`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={leaf.completed ? "#fcd34d" : "#cbd5e1"} />
                <stop offset="100%" stopColor={leaf.completed ? "#d97706" : "#64748b"} />
              </linearGradient>
            </defs>

            {isActive && (
              <circle
                cx="12" cy="0" r={leaf.completed ? "9" : "6"}
                fill="none"
                stroke={leaf.completed ? "#f59e0b" : "#94a3b8"}
                strokeWidth="4"
                className="animate-pulse"
                style={{ filter: 'blur(3px)' }}
              />
            )}

            <g className="transition-all duration-500">
              {/* Stem */}
              <path d="M 0,0 Q 6,0 12,0" stroke="#7c4a1e" strokeWidth="1.5" fill="none" className="transition-all duration-300 group-hover:stroke-[#925c27]" />
              
              {leaf.completed ? (
                // Blooming Fruit
                <g transform="translate(12, 0)">
                  <circle 
                    cx="0" cy="0" r="8" 
                    fill={\`url(#fruitGrad-\${leaf.id})\`} 
                    stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"} 
                    strokeWidth={isSelected ? 1.5 : 0} 
                    className="transition-all duration-300 group-hover:scale-125"
                    style={!isSelected ? { filter: 'drop-shadow(0 0px 8px rgba(245,158,11,0.5))' } : undefined}
                  />
                  {/* Inner shine */}
                  <path d="M -3,-4 A 4 4 0 0 1 3,-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </g>
              ) : (
                // Unripe Bud
                <g transform="translate(12, 0) scale(0.7)">
                  <path 
                    d="M 0,8 C 6,6 6,-6 0,-8 C -6,-6 -6,6 0,8 Z" 
                    fill={\`url(#fruitGrad-\${leaf.id})\`} 
                    stroke={isSelected ? "#fff" : "rgba(255,255,255,0.2)"} 
                    strokeWidth={isSelected ? 1 : 0.5} 
                    className="transition-all duration-300 group-hover:scale-110"
                  />
                </g>
              )}
            </g>
          </>
        ) : (
          <>
            ` + originalBody.trim().replace(/\n/g, '\n            ') + `
          </>
        )}`;

content = content.replace(originalBody, newBody + '\n        ');
fs.writeFileSync(file, content);
console.log('Success');
