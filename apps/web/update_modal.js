const fs = require('fs');
const file = '/Users/danielhumbertodiazgarcia/Documents/Development/BEAN/apps/web/features/life-tree/BranchDetailView.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add imports
content = content.replace("import { TaskCoachChat } from './TaskCoachChat';", "import { TaskCoachChat } from './TaskCoachChat';\nimport { motion, useDragControls } from 'framer-motion';");

// 2. Add drag hooks
const hooksAnchor = 'const [isFullScreen, setIsFullScreen] = useState(false);';
const newHooks = `const [isFullScreen, setIsFullScreen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const dragControls = useDragControls();

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 640);
    const handleResize = () => setIsDesktop(window.innerWidth >= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);`;
content = content.replace(hooksAnchor, newHooks);

// 3. Change main modal container
const modalStart = '<div \n        className="w-full h-full flex-1 sm:flex-none sm:w-[450px] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] sm:shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-500 pointer-events-auto border-t sm:border border-slate-100 m-0"\n        onClick={e => e.stopPropagation()}';

const newModalStart = `<motion.div 
        drag={isDesktop}
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        className="w-full h-full flex-1 sm:flex-none sm:w-[450px] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] sm:shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-500 pointer-events-auto border-t sm:border border-slate-100 m-0"
        onClick={e => e.stopPropagation()}`;
content = content.replace(modalStart, newModalStart);

// Close motion.div
const modalEnd = '      </div>\n    </div>\n  );\n}';
const newModalEnd = '      </motion.div>\n    </div>\n  );\n}';
content = content.replace(modalEnd, newModalEnd);

// 4. Add drag trigger to header
const headerStart = '<div className="shrink-0 px-5 sm:px-8 pb-5 sm:pb-6 pt-2 sm:pt-6 bg-white border-b border-slate-100 flex items-center justify-between">';
const newHeaderStart = `<div 
          className="shrink-0 px-5 sm:px-8 pb-5 sm:pb-6 pt-2 sm:pt-6 bg-white border-b border-slate-100 flex items-center justify-between sm:cursor-move"
          onPointerDown={(e) => {
            if (isDesktop) dragControls.start(e);
          }}
        >`;
content = content.replace(headerStart, newHeaderStart);

fs.writeFileSync(file, content);
console.log('Success');
