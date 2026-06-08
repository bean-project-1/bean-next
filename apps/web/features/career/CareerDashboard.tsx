'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Briefcase, FileText, Sparkles, 
  Plus, Trash2, CheckCircle2, ChevronRight, 
  Cpu, Copy, Check, RefreshCw, AlertCircle, Award, 
  BookOpen, Star, Trash, Eye
} from 'lucide-react';

interface Experience {
  company: string;
  role: string;
  description: string;
  duration: string;
}

interface Education {
  school: string;
  degree: string;
  year: string;
}

interface CVData {
  id?: string;
  title?: string;
  isBase?: boolean;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
}

export function CareerDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'simulator' | 'optimize'>('profile');
  
  // Resumes Inventory List
  const [resumes, setResumes] = useState<any[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  
  // Base CV Data State (Active Edit Target)
  const [loadingCV, setLoadingCV] = useState(true);
  const [rawCVText, setRawCVText] = useState('');
  const [cvData, setCvData] = useState<CVData>({
    summary: '',
    skills: [],
    experience: [],
    education: [],
    certifications: []
  });
  
  // Editor States
  const [newSkill, setNewSkill] = useState('');
  const [newCert, setNewCert] = useState('');
  const [savingCV, setSavingCV] = useState(false);
  const [parsingCV, setParsingCV] = useState(false);
  const [newCVTitle, setNewCVTitle] = useState('');

  // Job Simulator State
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobs, setJobs] = useState<any[]>([]);

  // Gap Analysis & Tailor States
  const [targetTitle, setTargetTitle] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  const [analyzingJob, setAnalyzingJob] = useState(false);
  const [gapAnalysis, setGapAnalysis] = useState<any | null>(null); // This stores the raw plan generated from IA
  
  const [tailoringResume, setTailoringResume] = useState(false);
  const [tailoredCV, setTailoredCV] = useState<any | null>(null);
  const [viewTailored, setViewTailored] = useState(false);
  
  const [copied, setCopied] = useState(false);
  const [savingTailored, setSavingTailored] = useState(false);
  const [tailoredSavedSuccess, setTailoredSavedSuccess] = useState(false);

  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  // Load Resumes & CV on Mount
  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoadingCV(true);
      const res = await fetch('/api/career/resume');
      const data = await res.json();
      if (data.success && data.resumes) {
        setResumes(data.resumes || []);
        
        // Find base CV or default to the first one
        const base = data.resumes.find((r: any) => r.isBase) || data.resumes[0];
        if (base) {
          setSelectedResumeId(base.id);
          setRawCVText(base.rawText || '');
          setNewCVTitle(base.title || '');
          if (base.parsedData) {
            const parsed = base.parsedData;
            setCvData({
              id: base.id,
              title: base.title,
              isBase: base.isBase,
              summary: parsed.summary || '',
              skills: parsed.skills || [],
              experience: parsed.experience || [],
              education: parsed.education || [],
              certifications: parsed.certifications || []
            });
          }
        } else {
          // No CVs at all
          setCvData({
            summary: '',
            skills: [],
            experience: [],
            education: [],
            certifications: []
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCV(false);
    }
  };

  // Select a CV to view/edit in the editor
  const handleSelectResume = (id: string) => {
    const selected = resumes.find(r => r.id === id);
    if (!selected) return;
    
    setSelectedResumeId(id);
    setRawCVText(selected.rawText || '');
    setNewCVTitle(selected.title || '');
    if (selected.parsedData) {
      const parsed = selected.parsedData;
      setCvData({
        id: selected.id,
        title: selected.title,
        isBase: selected.isBase,
        summary: parsed.summary || '',
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        certifications: parsed.certifications || []
      });
    }
  };

  // AI Parse Resume (creates a new entry)
  const handleParseResume = async () => {
    if (!rawCVText.trim()) return;
    try {
      setParsingCV(true);
      const res = await fetch('/api/career/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: rawCVText,
          title: newCVTitle.trim() || undefined 
        })
      });
      const data = await res.json();
      if (data.success && data.resume) {
        alert('¡Hoja de vida parseada y añadida al inventario con éxito!');
        await fetchResumes();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error procesando el CV.');
    } finally {
      setParsingCV(false);
    }
  };

  // Manual save CV edits
  const handleSaveCVEdits = async () => {
    if (!selectedResumeId) return;
    try {
      setSavingCV(true);
      const res = await fetch('/api/career/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedResumeId,
          title: newCVTitle || cvData.title || 'Mi Hoja de Vida',
          summary: cvData.summary,
          parsedData: cvData,
          isBase: cvData.isBase
        })
      });
      const data = await res.json();
      if (data.success) {
        alert('Cambios guardados en el inventario con éxito.');
        await fetchResumes();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al guardar cambios.');
    } finally {
      setSavingCV(false);
    }
  };

  // Set CV as Base
  const handleSetBase = async (id: string) => {
    try {
      const res = await fetch(`/api/career/resume/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBase: true })
      });
      const data = await res.json();
      if (data.success) {
        await fetchResumes();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete CV
  const handleDeleteResume = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta hoja de vida de tu inventario?')) return;
    try {
      const res = await fetch(`/api/career/resume/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await fetchResumes();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Save Tailored CV to Inventory
  const handleSaveTailoredCV = async () => {
    if (!tailoredCV) return;
    try {
      setSavingTailored(true);
      setTailoredSavedSuccess(false);
      
      const textRepresentation = `
PERFIL PROFESIONAL OPTIMIZADO:
${tailoredCV.summary}

HABILIDADES:
${tailoredCV.skills?.join(', ')}

EXPERIENCIA ADAPTADA:
${tailoredCV.experience?.map((e: any) => `- ${e.role} en ${e.company} (${e.duration}):\n  ${e.description}`).join('\n\n')}
      `;

      const res = await fetch('/api/career/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textRepresentation,
          title: `CV Optimizado: ${targetTitle} - ${targetCompany}`,
          targetJob: targetTitle,
          targetCompany: targetCompany,
          parsedData: tailoredCV
        })
      });
      const data = await res.json();
      if (data.success) {
        setTailoredSavedSuccess(true);
        await fetchResumes();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingTailored(false);
    }
  };

  // Job Simulator trigger
  const handleSimulateJobs = async () => {
    try {
      setLoadingJobs(true);
      setJobs([]);
      const res = await fetch('/api/career/jobs');
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Step 1: Diagnose Gaps (AI call, preview plan)
  const handleDiagnoseJob = async () => {
    if (!targetTitle || !targetCompany || !jobDescription) return;
    try {
      setAnalyzingJob(true);
      setGapAnalysis(null);
      setTailoredCV(null);
      setViewTailored(false);
      setPlanSaved(false);
      setTailoredSavedSuccess(false);

      const res = await fetch('/api/career/jobs/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: targetTitle,
          company: targetCompany,
          jobOfferText: jobDescription
        })
      });
      
      const data = await res.json();
      if (data.success) {
        setGapAnalysis(data.plan); // Stores the full structured plan returned by AI
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al diagnosticar la vacante.');
    } finally {
      setAnalyzingJob(false);
    }
  };

  // Step 2: Inject to tree (Persist the generated plan)
  const handleInjectPlanToTree = async () => {
    if (!gapAnalysis) return;
    try {
      setSavingPlan(true);
      setPlanSaved(false);

      const res = await fetch('/api/career/jobs/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: gapAnalysis })
      });
      
      const data = await res.json();
      if (data.success) {
        setPlanSaved(true);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al inyectar el plan en el árbol.');
    } finally {
      setSavingPlan(false);
    }
  };

  // Tailor Resume trigger
  const handleTailorResume = async () => {
    if (!jobDescription) return;
    try {
      setTailoringResume(true);
      setViewTailored(false);
      setTailoredSavedSuccess(false);
      const res = await fetch('/api/career/resume/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobOfferText: jobDescription })
      });
      const data = await res.json();
      if (data.success) {
        setTailoredCV(data.tailoredResume);
        setViewTailored(true);

        // Auto-save the tailored CV directly to the inventory
        try {
          const saveRes = await fetch('/api/career/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `CV Optimizado: ${targetTitle} - ${targetCompany}`,
              targetJob: targetTitle,
              targetCompany: targetCompany,
              parsedData: data.tailoredResume
            })
          });
          const saveData = await saveRes.json();
          if (saveData.success) {
            setTailoredSavedSuccess(true);
            await fetchResumes(); // Refresh inventory list
          }
        } catch (saveErr) {
          console.error('Error al guardar automáticamente el CV optimizado:', saveErr);
        }
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error al adaptar la hoja de vida.');
    } finally {
      setTailoringResume(false);
    }
  };

  // Copy to clipboard helper
  const handleCopyTailored = () => {
    if (!tailoredCV) return;
    const textToCopy = `
PERFIL PROFESIONAL:
${tailoredCV.summary}

HABILIDADES CLAVE DESTACADAS:
${tailoredCV.skills?.join(', ')}

EXPERIENCIA ADAPTADA:
${tailoredCV.experience?.map((e: any) => `- ${e.role} en ${e.company} (${e.duration}):\n  ${e.description}`).join('\n\n')}

CERTIFICACIONES SUGERIDAS:
${tailoredCV.certifications?.join(', ')}
    `;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // CV Edit Helpers
  const addSkill = () => {
    if (newSkill.trim() && !cvData.skills.includes(newSkill.trim())) {
      setCvData({ ...cvData, skills: [...cvData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const next = [...cvData.skills];
    next.splice(index, 1);
    setCvData({ ...cvData, skills: next });
  };

  const addCert = () => {
    if (newCert.trim() && !cvData.certifications.includes(newCert.trim())) {
      setCvData({ ...cvData, certifications: [...cvData.certifications, newCert.trim()] });
      setNewCert('');
    }
  };

  const removeCert = (index: number) => {
    const next = [...cvData.certifications];
    next.splice(index, 1);
    setCvData({ ...cvData, certifications: next });
  };

  const addExperience = () => {
    setCvData({
      ...cvData,
      experience: [...cvData.experience, { company: '', role: '', description: '', duration: '' }]
    });
  };

  const updateExperience = (index: number, key: keyof Experience, value: string) => {
    const next = [...cvData.experience];
    next[index] = { ...next[index], [key]: value };
    setCvData({ ...cvData, experience: next });
  };

  const removeExperience = (index: number) => {
    const next = [...cvData.experience];
    next.splice(index, 1);
    setCvData({ ...cvData, experience: next });
  };

  const addEducation = () => {
    setCvData({
      ...cvData,
      education: [...cvData.education, { school: '', degree: '', year: '' }]
    });
  };

  const updateEducation = (index: number, key: keyof Education, value: string) => {
    const next = [...cvData.education];
    next[index] = { ...next[index], [key]: value };
    setCvData({ ...cvData, education: next });
  };

  const removeEducation = (index: number) => {
    const next = [...cvData.education];
    next.splice(index, 1);
    setCvData({ ...cvData, education: next });
  };

  const startNewCV = () => {
    setSelectedResumeId(null);
    setRawCVText('');
    setNewCVTitle('Nueva Hoja de Vida');
    setCvData({
      summary: '',
      skills: [],
      experience: [],
      education: [],
      certifications: []
    });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 sm:py-8 bg-stone-50 pb-32">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href="/dna" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors mb-3 text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className="w-4 h-4" /> Volver a Mi ADN
          </Link>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight flex items-center gap-3">
            <span>💼</span> Brújula de Carrera <span className="text-indigo-600 font-light italic">Compass</span>
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Gestiona tu inventario de CVs, simula vacantes ideales y optimiza tu perfil para postularte.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200/50 shadow-sm self-stretch md:self-auto">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'profile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <FileText className="w-4 h-4" /> Inventario de CVs
          </button>
          <button 
            onClick={() => {
              setActiveTab('simulator');
              if (jobs.length === 0) handleSimulateJobs();
            }}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'simulator' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <Cpu className="w-4 h-4" /> Simulador IA
          </button>
          <button 
            onClick={() => setActiveTab('optimize')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeTab === 'optimize' ? 'bg-white text-indigo-600 shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}
          >
            <Sparkles className="w-4 h-4" /> Optimizar CV
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* TAB 1: RESUME GALLERY & EDITOR */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Resumes Gallery (Inventory) */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      🗄️ Mi Inventario de Hojas de Vida
                    </h3>
                    <p className="text-xs text-stone-400">
                      Gestiona tus diferentes versiones. La hoja marcada como base nutre tu ADN Vital.
                    </p>
                  </div>
                  <button
                    onClick={startNewCV}
                    className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all"
                  >
                    <Plus className="w-4 h-4" /> Nueva Versión
                  </button>
                </div>

                {resumes.length === 0 ? (
                  <div className="text-center py-10 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 text-stone-400">
                    <p className="text-xs">No tienes hojas de vida guardadas en tu inventario.</p>
                    <p className="text-[10px] mt-1">Pega tu perfil abajo para parsearlo e iniciar tu galería.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resumes.map((r) => (
                      <div 
                        key={r.id}
                        onClick={() => handleSelectResume(r.id)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between min-h-[140px] ${
                          selectedResumeId === r.id 
                            ? 'border-indigo-600 bg-indigo-50/20 shadow-md shadow-indigo-500/5' 
                            : 'border-stone-100 bg-white hover:border-stone-200 hover:shadow-sm'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <h4 className="text-sm font-black text-stone-800 leading-tight line-clamp-1">
                              {r.title}
                            </h4>
                            {r.isBase && (
                              <span className="flex items-center gap-0.5 bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider">
                                <Star className="w-2.5 h-2.5 fill-current" /> Base
                              </span>
                            )}
                          </div>
                          
                          {r.targetJob && (
                            <p className="text-[10px] text-indigo-600 font-bold">
                              🎯 Adaptado: {r.targetJob} en {r.targetCompany || 'Empresa'}
                            </p>
                          )}
                          
                          <p className="text-[10px] text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                            {r.summary || 'Sin resumen ejecutivo.'}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-stone-100/50 flex justify-between items-center">
                          <span className="text-[9px] text-stone-400 font-medium">
                            Modificado: {new Date(r.updatedAt).toLocaleDateString('es-ES')}
                          </span>
                          
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            {!r.isBase && (
                              <button
                                title="Establecer como Base"
                                onClick={(e) => { e.stopPropagation(); handleSetBase(r.id); }}
                                className="p-1.5 bg-stone-50 hover:bg-green-50 text-stone-400 hover:text-green-600 rounded-lg transition-colors"
                              >
                                <Star className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              title="Eliminar"
                              onClick={(e) => { e.stopPropagation(); handleDeleteResume(r.id); }}
                              className="p-1.5 bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Edit Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Parse Box */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm">
                    <h3 className="text-base font-bold text-stone-900 mb-2 flex items-center gap-2">
                      📥 {selectedResumeId ? 'Re-Parsear / Cargar Texto' : 'Cargar Nueva Hoja de Vida'}
                    </h3>
                    <p className="text-xs text-stone-400 mb-4">
                      Pega el texto de tu currículum para que la IA extraiga los campos de forma automatizada.
                    </p>
                    
                    <textarea
                      value={rawCVText}
                      onChange={e => setRawCVText(e.target.value)}
                      placeholder="Pega aquí el contenido de tu hoja de vida, habilidades, historia laboral..."
                      className="w-full h-80 bg-stone-50/50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 outline-none transition-all resize-none shadow-inner"
                    />

                    <button
                      onClick={handleParseResume}
                      disabled={parsingCV || !rawCVText.trim()}
                      className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-md shadow-indigo-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      {parsingCV ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Procesando con IA...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" /> {selectedResumeId ? 'Parsear e Importar' : 'Parsear y Crear'}
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* CV Interactive Editor */}
                <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-4 gap-4">
                    <div className="flex-1 w-full">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Editando Hoja de Vida</span>
                      <input 
                        type="text"
                        value={newCVTitle}
                        onChange={e => setNewCVTitle(e.target.value)}
                        placeholder="Nombre de esta versión"
                        className="text-lg font-bold text-stone-900 border-b border-dashed border-stone-200 hover:border-indigo-400 focus:border-indigo-600 outline-none w-full bg-transparent pb-0.5 mt-0.5"
                      />
                    </div>
                    
                    <button
                      onClick={handleSaveCVEdits}
                      disabled={savingCV || !selectedResumeId}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md shadow-emerald-500/10 disabled:opacity-50 transition-all flex items-center gap-1.5 whitespace-nowrap align-middle"
                    >
                      {savingCV ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>

                  {loadingCV ? (
                    <div className="space-y-4 py-12">
                      <div className="h-6 w-1/4 bg-stone-100 rounded animate-pulse" />
                      <div className="h-24 bg-stone-100 rounded-2xl animate-pulse" />
                      <div className="h-6 w-1/3 bg-stone-100 rounded animate-pulse" />
                      <div className="h-12 bg-stone-100 rounded-2xl animate-pulse" />
                    </div>
                  ) : !selectedResumeId ? (
                    <div className="text-center py-20 bg-stone-50/20 rounded-2xl border border-dashed border-stone-200">
                      <span className="text-4xl block mb-2">👈</span>
                      <h4 className="text-sm font-bold text-stone-800">Selecciona un CV del inventario o parsea uno nuevo</h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto">
                        Debes seleccionar una hoja de vida de tu galería arriba o pegar el texto a la izquierda para poder editarla interactivamente.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Summary */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Perfil Profesional</label>
                        <textarea
                          value={cvData.summary}
                          onChange={e => setCvData({ ...cvData, summary: e.target.value })}
                          placeholder="Define tu enfoque profesional e identidad de carrera..."
                          className="w-full h-24 bg-stone-50/50 border border-stone-200 rounded-2xl p-4 text-xs text-stone-800 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                        />
                      </div>

                      {/* Skills Tags */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Habilidades (DNA Skills)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {cvData.skills.map((skill, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-100/50 pl-3 pr-2 py-1 rounded-xl text-xs font-semibold">
                              {skill}
                              <button onClick={() => removeSkill(idx)} className="text-indigo-400 hover:text-indigo-700 p-0.5 rounded">
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                          <input
                            type="text"
                            value={newSkill}
                            onChange={e => setNewSkill(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addSkill()}
                            placeholder="Ej. Next.js, Product Design"
                            className="flex-1 bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none"
                          />
                          <button onClick={addSkill} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-xl text-stone-600 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Certificaciones (DNA Knowledge)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {cvData.certifications.map((cert, idx) => (
                            <span key={idx} className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100/50 pl-3 pr-2 py-1 rounded-xl text-xs font-semibold">
                              {cert}
                              <button onClick={() => removeCert(idx)} className="text-amber-400 hover:text-amber-700 p-0.5 rounded">
                                &times;
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 max-w-sm">
                          <input
                            type="text"
                            value={newCert}
                            onChange={e => setNewCert(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addCert()}
                            placeholder="Ej. AWS Cloud Practitioner"
                            className="flex-1 bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2 text-xs focus:border-indigo-500 outline-none"
                          />
                          <button onClick={addCert} className="bg-stone-100 hover:bg-stone-200 p-2 rounded-xl text-stone-600 transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Work Experience */}
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-t border-stone-100 pt-6">
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Experiencia Laboral</label>
                          <button
                            onClick={addExperience}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Añadir Experiencia
                          </button>
                        </div>

                        {cvData.experience.map((exp, idx) => (
                          <div key={idx} className="p-5 bg-stone-50/60 border border-stone-200/50 rounded-2xl space-y-4 relative group">
                            <button
                              onClick={() => removeExperience(idx)}
                              className="absolute top-4 right-4 text-stone-400 hover:text-red-500 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <input
                                  type="text"
                                  value={exp.role}
                                  onChange={e => updateExperience(idx, 'role', e.target.value)}
                                  placeholder="Cargo"
                                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={e => updateExperience(idx, 'company', e.target.value)}
                                  placeholder="Empresa"
                                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                                />
                              </div>
                              <div>
                                <input
                                  type="text"
                                  value={exp.duration}
                                  onChange={e => updateExperience(idx, 'duration', e.target.value)}
                                  placeholder="Duración (e.g. 2022 - Presente)"
                                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                                />
                              </div>
                            </div>

                            <textarea
                              value={exp.description}
                              onChange={e => updateExperience(idx, 'description', e.target.value)}
                              placeholder="Descripción de logros y responsabilidades..."
                              className="w-full h-20 bg-white border border-stone-200 rounded-xl p-3 text-xs outline-none focus:border-indigo-500 transition-all resize-none shadow-sm"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Education */}
                      <div className="space-y-4 border-t border-stone-100 pt-6">
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-bold uppercase tracking-wider text-stone-400">Educación</label>
                          <button
                            onClick={addEducation}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" /> Añadir Educación
                          </button>
                        </div>

                        {cvData.education.map((edu, idx) => (
                          <div key={idx} className="p-5 bg-stone-50/60 border border-stone-200/50 rounded-2xl relative grid grid-cols-1 md:grid-cols-4 gap-4">
                            <button
                              onClick={() => removeEducation(idx)}
                              className="absolute top-2 right-2 text-stone-400 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="md:col-span-2">
                              <input
                                type="text"
                                value={edu.degree}
                                onChange={e => updateEducation(idx, 'degree', e.target.value)}
                                placeholder="Título / Grado"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={edu.school}
                                onChange={e => updateEducation(idx, 'school', e.target.value)}
                                placeholder="Universidad / Institución"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={edu.year}
                                onChange={e => updateEducation(idx, 'year', e.target.value)}
                                placeholder="Año"
                                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: JOB SIMULATOR */}
          {activeTab === 'simulator' && (
            <motion.div
              key="simulator"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">🧬 Simulador de Compatibilidad de Empleos</h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Nuestra IA analiza tu ADN vital y experiencia base para crear roles óptimos de mercado.
                  </p>
                </div>
                <button
                  onClick={handleSimulateJobs}
                  disabled={loadingJobs}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-md shadow-indigo-500/10 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingJobs ? 'animate-spin' : ''}`} />
                  {loadingJobs ? 'Simulando vacantes...' : 'Simular Empleos de Ensueño'}
                </button>
              </div>

              {loadingJobs && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-96 rounded-3xl bg-white border border-stone-200/40 p-6 space-y-4 animate-pulse">
                      <div className="h-6 w-2/3 bg-stone-100 rounded" />
                      <div className="h-4 w-1/3 bg-stone-100 rounded" />
                      <div className="h-32 bg-stone-100 rounded-2xl" />
                      <div className="h-10 bg-stone-100 rounded-xl" />
                    </div>
                  ))}
                </div>
              )}

              {!loadingJobs && jobs.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/40 shadow-sm">
                  <span className="text-5xl block mb-4">🔍</span>
                  <h4 className="text-base font-bold text-stone-950">Sin simulaciones activas</h4>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                    Haz clic en el botón de arriba para que la IA escanee tu ADN y te sugiera cargos alineados.
                  </p>
                </div>
              )}

              {!loadingJobs && jobs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {jobs.map((job, idx) => (
                    <div key={idx} className="bg-white rounded-3xl border border-stone-200/60 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-indigo-50 text-indigo-700 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                        Match {job.alignment?.overall}%
                      </div>
                      
                      <div>
                        <span className="text-2xl block mb-3">🏢</span>
                        <h4 className="text-base font-black text-stone-900 leading-tight">{job.title}</h4>
                        <p className="text-xs text-stone-400 font-bold mt-1">{job.company}</p>
                        
                        <p className="text-xs text-stone-500 mt-4 leading-relaxed line-clamp-3">
                          {job.description}
                        </p>

                        {/* Scores breakdowns */}
                        <div className="mt-5 space-y-2 border-t border-stone-50 pt-4">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-stone-400 font-bold uppercase tracking-tight">Habilidades (Capital):</span>
                            <span className="font-extrabold text-blue-600">{job.alignment?.skills}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${job.alignment?.skills}%` }} />
                          </div>

                          <div className="flex justify-between text-[10px]">
                            <span className="text-stone-400 font-bold uppercase tracking-tight">Valores (Identidad):</span>
                            <span className="font-extrabold text-violet-600">{job.alignment?.values}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-500" style={{ width: `${job.alignment?.values}%` }} />
                          </div>
                        </div>

                        {/* Key requirements tags */}
                        <div className="mt-4 flex flex-wrap gap-1">
                          {job.requirements?.slice(0, 3).map((req: string, i: number) => (
                            <span key={i} className="bg-stone-50 text-stone-500 border border-stone-200/50 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-stone-50">
                        <button
                          onClick={() => {
                            setTargetTitle(job.title);
                            setTargetCompany(job.company);
                            setJobDescription(job.requirements?.join('\n') || job.description);
                            setActiveTab('optimize');
                          }}
                          className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          Analizar Brecha & Plan <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: RESUME OPTIMIZER & GAP ANALYZER */}
          {activeTab === 'optimize' && (
            <motion.div
              key="optimize"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {resumes.length === 0 ? (
                <div className="bg-amber-50 border border-amber-200/50 p-8 rounded-3xl max-w-xl mx-auto text-center space-y-4 shadow-sm">
                  <span className="text-4xl block">📋</span>
                  <h4 className="text-base font-black text-stone-900">Se requiere una Hoja de Vida</h4>
                  <p className="text-xs text-stone-500 leading-relaxed max-w-md mx-auto">
                    Para poder diagnosticar brechas de carrera y adaptar tu currículum con IA para una vacante, primero debes cargar o redactar una hoja de vida en tu inventario.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/10"
                    >
                      Ir al Inventario de CVs &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs Box */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-stone-200/60 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                      🎯 Configurar Vacante
                    </h3>
                    <p className="text-xs text-stone-400">
                      Ingresa los detalles de la oferta de empleo que sueñas conseguir para analizarla.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Nombre del Cargo</label>
                      <input
                        type="text"
                        value={targetTitle}
                        onChange={e => setTargetTitle(e.target.value)}
                        placeholder="Ej. Senior Frontend Dev"
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Empresa / Organización</label>
                      <input
                        type="text"
                        value={targetCompany}
                        onChange={e => setTargetCompany(e.target.value)}
                        placeholder="Ej. Stripe, MercadoLibre"
                        className="w-full bg-stone-50/50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Descripción / Requisitos de la Oferta</label>
                      <textarea
                        value={jobDescription}
                        onChange={e => setJobDescription(e.target.value)}
                        placeholder="Pega aquí la descripción completa de las responsabilidades y requisitos..."
                        className="w-full h-48 bg-stone-50/50 border border-stone-200 rounded-xl p-4 text-xs outline-none focus:border-indigo-500 resize-none shadow-inner"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleDiagnoseJob}
                        disabled={analyzingJob || !targetTitle.trim() || !jobDescription.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-2xl shadow-md shadow-indigo-500/10 flex items-center justify-center gap-2 transition-all"
                      >
                        {analyzingJob ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Analizando...
                          </>
                        ) : (
                          <>
                            <Cpu className="w-4 h-4" /> Diagnosticar Brechas
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gap & Plan Outputs */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Gaps Banner */}
                  {gapAnalysis && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6 animate-fade-in">
                      <div className="flex justify-between items-start border-b border-stone-100 pb-4">
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Diagnóstico de Carrera</span>
                          <h3 className="text-lg font-black text-stone-900 mt-1">{targetTitle} en {targetCompany}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-extrabold text-indigo-600">{gapAnalysis.readinessScore || 50}%</span>
                          <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Alistamiento Actual</p>
                        </div>
                      </div>

                      {/* Gaps detected */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 text-amber-500" /> Brechas en tu ADN
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {gapAnalysis.gaps?.map((gap: string, i: number) => (
                            <li key={i} className="bg-amber-50/50 text-amber-800 border border-amber-100/50 p-3 rounded-xl text-xs font-semibold flex items-start gap-2">
                              <span className="text-amber-500 mt-0.5">•</span> {gap}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Plan Preview Block */}
                      <div className="space-y-4 border-t border-stone-100 pt-6">
                        <h4 className="text-xs font-black uppercase tracking-widest text-stone-400">
                          📋 Previsualización del Plan Sugerido (IA)
                        </h4>
                        
                        <div className="space-y-3">
                          {gapAnalysis.phases?.map((phase: any, pIdx: number) => (
                            <div key={pIdx} className="bg-stone-50/60 border border-stone-200/50 p-4 rounded-2xl space-y-2">
                              <div className="flex justify-between items-center">
                                <h5 className="text-xs font-black text-stone-850">{phase.title}</h5>
                                <span className="text-[8px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Límite: ~{phase.targetDaysFromNow || 30} días
                                </span>
                              </div>
                              {phase.description && <p className="text-[10px] text-stone-500 leading-relaxed">{phase.description}</p>}
                              
                              {/* Tasks */}
                              <div className="space-y-1 pt-2">
                                {phase.tasks?.map((task: any, tIdx: number) => (
                                  <div key={tIdx} className="flex justify-between text-[10px] bg-white border border-stone-100 p-2 rounded-xl text-stone-600 shadow-sm">
                                    <span>• {task.name}</span>
                                    <span className="text-stone-400 font-bold">{task.estimatedHours}h</span>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Milestone */}
                              {phase.milestone && (
                                <div className="bg-indigo-50/50 border border-indigo-100/20 p-3 rounded-xl text-[9px] text-indigo-800 font-medium">
                                  🏆 <b>Hito:</b> {phase.milestone.title}
                                  {phase.milestone.description && <p className="text-[8px] text-indigo-600 mt-0.5">{phase.milestone.description}</p>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Habits */}
                        {gapAnalysis.habits?.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-stone-400">Hábitos Recomendados</h5>
                            <div className="flex flex-wrap gap-2">
                              {gapAnalysis.habits.map((habit: any, hIdx: number) => (
                                <span key={hIdx} className="bg-violet-50 text-violet-700 border border-violet-100 px-3 py-1 rounded-xl text-[10px] font-semibold">
                                  🔄 {habit.title} ({habit.frequency?.value}x {habit.frequency?.type === 'weekly' ? 'semanal' : 'diario'})
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions Taken / Tree Sync */}
                      {planSaved ? (
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 p-4 rounded-2xl flex items-center gap-4">
                          <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-extrabold">¡Plan inyectado al Árbol de Vida con éxito!</p>
                            <p className="text-[10px] text-emerald-600 mt-0.5">
                              Se ha creado una nueva rama (Goal) llamada &ldquo;Conseguir empleo...&rdquo; con sus correspondientes fases y tareas (hojas). Complétalas para crecer tu árbol.
                            </p>
                          </div>
                          <Link href="/home" className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold whitespace-nowrap hover:bg-emerald-700 transition-colors">
                            Ver mi Árbol →
                          </Link>
                        </div>
                      ) : (
                        <div className="bg-stone-50 border border-stone-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                          <div className="text-center sm:text-left">
                            <h5 className="text-xs font-bold text-stone-900">¿Deseas agregar este plan a tu árbol?</h5>
                            <p className="text-[10px] text-stone-400">
                              Se creará una rama de preparación profesional con fases, tareas y hábitos interactivos.
                            </p>
                          </div>
                          <button
                            onClick={handleInjectPlanToTree}
                            disabled={savingPlan}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all whitespace-nowrap"
                          >
                            {savingPlan ? 'Inyectando...' : 'Vincular a mi Árbol'}
                          </button>
                        </div>
                      )}

                      {/* Resume optimization trigger block */}
                      <div className="border-t border-stone-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-center sm:text-left">
                          <h4 className="text-sm font-bold text-stone-900">¿Quieres postularte ahora?</h4>
                          <p className="text-xs text-stone-400">
                            La IA optimizará la redacción de tu perfil base para enfocarlo al 100% en esta vacante.
                          </p>
                        </div>
                        <button
                          onClick={handleTailorResume}
                          disabled={tailoringResume}
                          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md shadow-indigo-500/10 flex items-center gap-2 transition-all"
                        >
                          {tailoringResume ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> Adaptando...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" /> Optimizar Mi CV Base
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Optimization Compare Display */}
                  {viewTailored && tailoredCV && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/60 shadow-sm space-y-6"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-stone-100 pb-4 gap-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> Vista Comparativa & Optimización ATS
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handleSaveTailoredCV}
                            disabled={savingTailored || tailoredSavedSuccess}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-70"
                          >
                            {savingTailored ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : tailoredSavedSuccess ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" /> ¡Guardado!
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" /> Guardar en Inventario
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={handleCopyTailored}
                            className="bg-stone-50 hover:bg-stone-100 border border-stone-200 px-4 py-2 rounded-xl text-xs font-bold text-stone-700 transition-all flex items-center gap-1.5"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-600" /> ¡Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" /> Copiar Texto
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Original CV */}
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-medium">CV Original (Base)</span>
                          
                          <div className="p-4 bg-stone-50/50 rounded-2xl border border-stone-200/40 text-stone-600 space-y-3">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-stone-400">Resumen Base</p>
                              <p className="text-xs mt-1 leading-relaxed">{cvData.summary || 'Sin perfil cargado.'}</p>
                            </div>
                            <div className="border-t border-stone-100 pt-3">
                              <p className="text-[10px] font-bold uppercase text-stone-400">Experiencias Base</p>
                              <div className="space-y-2 mt-2">
                                {cvData.experience?.slice(0, 2).map((exp, idx) => (
                                  <div key={idx} className="text-xs">
                                    <p className="font-bold text-stone-700">{exp.role} en {exp.company}</p>
                                    <p className="text-[10px] text-stone-500 mt-0.5 truncate">{exp.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tailored CV */}
                        <div className="space-y-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">CV Optimizado para la Vacante</span>

                          <div className="p-4 bg-indigo-50/20 border border-indigo-100/50 rounded-2xl text-stone-700 space-y-4">
                            <div>
                              <p className="text-[10px] font-bold uppercase text-indigo-500">Resumen Optimizado</p>
                              <p className="text-xs mt-1 leading-relaxed text-indigo-950 font-medium">{tailoredCV.summary}</p>
                            </div>
                            <div className="border-t border-indigo-100/40 pt-3">
                              <p className="text-[10px] font-bold uppercase text-indigo-500">Experiencias Adaptadas</p>
                              <div className="space-y-3 mt-2">
                                {tailoredCV.experience?.map((exp: any, idx: number) => (
                                  <div key={idx} className="text-xs">
                                    <p className="font-bold text-indigo-900">{exp.role} en {exp.company}</p>
                                    <p className="text-[10px] text-indigo-950/70 mt-1 leading-relaxed">{exp.description}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {!gapAnalysis && !analyzingJob && (
                    <div className="text-center py-24 bg-white rounded-3xl border border-stone-200/40 shadow-sm">
                      <span className="text-5xl block mb-4">🎯</span>
                      <h4 className="text-base font-bold text-stone-900">Analiza tus brechas profesionales</h4>
                      <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                        Selecciona una vacante en el Simulador o ingresa los datos a la izquierda para diagnosticar las brechas de tu ADN.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
