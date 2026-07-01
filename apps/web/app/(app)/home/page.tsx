'use client';

import React, { useState, useEffect } from 'react';
import DnaModal from '../../../features/life-tree/DnaModal';
import NodeSidePanel from '../../../features/life-tree/NodeSidePanel';
import { LifeTree } from '../../../features/life-tree/LifeTree';
import { TaskDetailModal } from '../../../features/schedule/TaskDetailModal';
import { BranchDetailView } from '../../../features/life-tree/BranchDetailView';
import { TreeData } from '../../../features/life-tree/types';
import { useLifeTree } from '../../../hooks/useLifeTree';
import { ForestCarousel } from '../../../features/forest/components/ForestCarousel';
import { getSpaces } from '../../../features/spaces/actions/spaces';
import { useUIStore } from '../../../hooks/useUIStore';
import { useGlobalChat } from '../../../features/chat/GlobalChatProvider';

export default function HomePage() {
  const isSpaceZoomed = useUIStore(state => state.isSpaceZoomed);
  const [isDnaOpen, setIsDnaOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<any>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [selectedTaskForModal, setSelectedTaskForModal] = useState<any | null>(null);
  
  const [spaces, setSpaces] = useState<{ id: string; name: string; role?: string; membersList?: any[] }[]>([]);
  const [activeSpaceIndex, setActiveSpaceIndex] = useState(0);
  
  useEffect(() => {
    getSpaces().then(data => {
      setSpaces([
        { id: 'personal', name: 'Mi Árbol', role: 'owner', membersList: [] },
        ...data.map(s => ({ id: s.id, name: s.name, role: s.role, membersList: s.membersList }))
      ]);
    }).catch(console.error);
  }, []);

  // When the branch panel closes, dismiss any task modals opened from within it
  useEffect(() => {
    if (selectedBranchId === null) {
      setSelectedTaskForModal(null);
      setSelectedAction(null);
    }
  }, [selectedBranchId]);

  const safeSpaceIndex = spaces.length > 0 ? ((activeSpaceIndex % spaces.length) + spaces.length) % spaces.length : 0;
  const activeSpaceId = spaces[safeSpaceIndex]?.id || 'personal';
  const { treeData, loading, deleteGoal, deleteAction, updateAction, addAction, updateGoal, updateTask, refresh, error } = useLifeTree(activeSpaceId);

  const { openChat } = useGlobalChat();

  useEffect(() => {
    if (loading) return;

    // A. Handle value-first onboarding flow (unseeded goal text)
    const pendingGoal = sessionStorage.getItem('just_onboarded_goal');
    if (pendingGoal) {
      sessionStorage.removeItem('just_onboarded_goal');
      sessionStorage.setItem('first_tour_active', 'true');
      
      setTimeout(() => {
        openChat(undefined, 'refactor_goal', {
          isNewDraftFromOnboarding: true,
          goalText: pendingGoal
        });
        
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('start-onboarding-tour'));
        }, 1500);
      }, 800);
      return;
    }

    // B. Fallback: Already seeded goal tree onboarding
    if (treeData && treeData.branches && treeData.branches.length > 0) {
      if (sessionStorage.getItem('just_onboarded') === 'true') {
        sessionStorage.removeItem('just_onboarded');
        const firstBranch = treeData.branches[0];
        setSelectedBranchId(firstBranch.id);
        
        setTimeout(() => {
          openChat(
            `¡Hola! Estoy listo para guiarte en tu meta: "${firstBranch.goal}". ¿Quieres afinar algún detalle, o empezamos de una vez con las primeras tareas?`,
            'tree',
            firstBranch
          );
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('start-onboarding-tour'));
          }, 500);
        }, 800);
      }
    }
  }, [loading, treeData, openChat]);

  const handleLeafClick = (id: string | null) => {
    if (!id) {
      setSelectedAction(null);
      return;
    }
    if (!treeData) return;
    for (const b of treeData.branches) {
      const act = b.leaves.find((a: any) => a.id === id);
      if (act) {
        setSelectedBranchId(b.id);
        if (act.parentId) {
          setSelectedPhaseId(act.parentId);
        }
        setSelectedAction(act);
        
        // Map GoalAction to ScheduledEvent format and open the modal!
        const event: any = {
          id: act.id,
          title: act.name,
          description: act.description || '',
          notes: act.notes || '',
          startDate: act.startDate ? new Date(act.startDate).toISOString() : undefined,
          date: act.targetDate ? new Date(act.targetDate).toISOString() : '',
          type: act.type || 'task',
          status: act.completed ? 'completed' : 'pending',
          goalId: b.id,
          goalTitle: b.goal,
          dimensions: act.dimensions || [],
          attributes: act.attributes || [],
          tasks: act.tasks || [],
          itemType: 'action',
          assignee: act.assignee || null,
          baseCommitmentId: (act as any).baseCommitmentId || null,
          baseCommitmentTitle: (act as any).baseCommitmentTitle || null,
          completedCount: (act as any).completedCount || 0,
          totalSessions: (act as any).totalSessions || null
        };
        setSelectedTaskForModal(event);
        break;
      }
    }
  };

  const handlePhaseClick = (phaseId: string | null) => {
    setSelectedPhaseId(phaseId);
    if (!phaseId || !treeData) return;
    for (const b of treeData.branches) {
      const phase = b.leaves.find((a: any) => a.id === phaseId);
      if (phase) {
        setSelectedBranchId(b.id);
        break;
      }
    }
  };

  const handleDeleteGoal = async (id: string) => {
    const res = await deleteGoal(id);
    if (res.success) {
      setSelectedBranchId(null);
      setSelectedPhaseId(null);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleToggleAction = async (id: string, data: { completed?: boolean; targetDate?: string; dimensions?: string[]; attributes?: string[] }) => {
    const res = await updateAction(id, { 
      isCompleted: data.completed,
      targetDate: data.targetDate,
      dimensions: data.dimensions,
      attributes: data.attributes
    });
    if (res.success) {
      if (selectedAction?.id === id) {
        setSelectedAction({ ...selectedAction, ...data });
      }
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleDeleteAction = async (id: string) => {
    const res = await deleteAction(id);
    if (res.success) {
      setSelectedAction(null);
    } else {
      alert('Error: ' + res.error);
    }
  };

  const handleToggleTask = async (taskId: string, isCompleted: boolean) => {
    if (!updateTask) return;
    const res = await updateTask(taskId, isCompleted);
    if (res.success) {
      // Update selected action tasks optimistic UI
      if (selectedAction) {
        const newTasks = selectedAction.tasks.map((t: any) => t.id === taskId ? { ...t, isCompleted } : t);
        setSelectedAction({ ...selectedAction, tasks: newTasks });
      }
    } else {
      alert('Error al actualizar la tarea: ' + res.error);
    }
  };

  if (loading && !treeData) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargando tu BEAN...</span>
        </div>
      </div>
    );
  }

  if (!treeData) return null;

  return (
    <div className="flex h-screen bg-transparent flex-col relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <main className="flex-1 relative">
            <ForestCarousel 
              spaces={spaces}
              activeIndex={activeSpaceIndex}
              onIndexChange={setActiveSpaceIndex}
              onSpaceCreated={(newSpace) => {
                setSpaces(prev => [...prev, newSpace]);
                setActiveSpaceIndex(spaces.length);
              }}
              onActionHooks={{
                onLeafClick: handleLeafClick,
                onScoreClick: () => setIsDnaOpen(true),
                onRefresh: refresh,
                activePhaseId: selectedPhaseId,
                activeLeafId: selectedAction?.id,
                activeBranchId: selectedBranchId,
                onEditBranch: (b: any) => setSelectedBranchId(b ? b.id : null),
                onPhaseClick: handlePhaseClick,
                onDeleteBranch: (b: any) => handleDeleteGoal(b.id)
              }}
            />
        </main>
      </div>

      <DnaModal isOpen={isDnaOpen} onClose={() => setIsDnaOpen(false)} />

      {(() => {
        const branch = treeData.branches.find(b => b.id === selectedBranchId);
        if (!branch) return null;
        return (
          <BranchDetailView
            branch={branch}
            zoomedPhaseId={selectedPhaseId}
            activeLeafId={selectedAction?.id}
            onPhaseSelect={setSelectedPhaseId}
            onClose={() => setSelectedBranchId(null)}
            onDelete={handleDeleteGoal}
            onUpdateGoal={async (id, data) => {
              const res = await updateGoal(id, data);
              if (!res.success) alert('Error: ' + res.error);
            }}
            onToggleAction={handleToggleAction}
            onDeleteAction={handleDeleteAction}
            onLeafClick={handleLeafClick}
            onAddAction={addAction}
            onOpenTaskModal={(item, itemType) => {
              const event: any = {
                id: item.id,
                title: item.name || item.title,
                description: item.description || '',
                notes: item.notes || '',
                startDate: item.startDate ? new Date(item.startDate).toISOString() : undefined,
                date: item.targetDate ? new Date(item.targetDate).toISOString() : (item.endDate ? new Date(item.endDate).toISOString() : ''),
                type: item.type || (itemType === 'task' ? 'subtask' : 'task'),
                status: (item.completed || item.isCompleted) ? 'completed' : 'pending',
                goalId: branch.id,
                goalTitle: branch.goal,
                dimensions: item.dimensions || [],
                attributes: item.attributes || [],
                tasks: item.tasks || [],
                itemType: itemType, // 'action' | 'task'
                assignee: item.assignee || null,
                baseCommitmentId: (item as any).baseCommitmentId || null,
                baseCommitmentTitle: (item as any).baseCommitmentTitle || null,
                completedCount: (item as any).completedCount || 0,
                totalSessions: (item as any).totalSessions || null
              };
              setSelectedTaskForModal(event);
            }}
          />
        );
      })()}

      {selectedTaskForModal && (
        <TaskDetailModal
          task={selectedTaskForModal}
          onClose={() => setSelectedTaskForModal(null)}
          onDelete={async (id) => {
            let res;
            if (selectedTaskForModal.itemType === 'task') {
              res = await fetch(`/api/profile/goals/tasks/${id}`, { method: 'DELETE' }).then(r => r.json());
            } else {
              res = await deleteAction(id);
            }
            if (res.success) {
              setSelectedTaskForModal(null);
              setSelectedAction(null);
              refresh();
            } else {
              alert('Error: ' + (res.error || 'No se pudo eliminar'));
            }
          }}
          onToggle={async (id, isCompleted) => {
            let res;
            if (selectedTaskForModal.itemType === 'task') {
              res = await updateTask(id, isCompleted);
            } else {
              res = await updateAction(id, { isCompleted });
            }
            if (res.success) {
              setSelectedTaskForModal(prev => prev ? { ...prev, status: isCompleted ? 'completed' : 'pending' } : null);
              if (selectedAction?.id === id) {
                setSelectedAction({ ...selectedAction, completed: isCompleted });
              }
              refresh();
            } else {
              alert('Error: ' + res.error);
            }
          }}
          onUpdate={async (id, data) => {
            let res;
            if (selectedTaskForModal.itemType === 'task') {
              res = await fetch(`/api/profile/goals/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: data.title, notes: data.notes })
              }).then(r => r.json());
            } else {
              res = await fetch(`/api/profile/goals/actions/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: data.title, notes: data.notes })
              }).then(r => r.json());
            }
            if (res.success) {
              setSelectedTaskForModal(prev => prev ? { ...prev, title: data.title, notes: data.notes } : null);
              if (selectedAction?.id === id) {
                setSelectedAction({ ...selectedAction, name: data.title, notes: data.notes });
              }
              refresh();
            } else {
              alert('Error: ' + (res.error || 'No se pudo actualizar'));
            }
          }}
          onToggleTask={async (taskId, isCompleted) => {
            if (!updateTask) return;
            const res = await updateTask(taskId, isCompleted);
            if (res.success) {
              setSelectedTaskForModal(prev => {
                if (!prev) return null;
                const newTasks = prev.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted } : t);
                return { ...prev, tasks: newTasks };
              });
              if (selectedAction) {
                const newTasks = selectedAction.tasks?.map((t: any) => t.id === taskId ? { ...t, isCompleted } : t);
                setSelectedAction({ ...selectedAction, tasks: newTasks });
              }
              refresh();
            } else {
              alert('Error: ' + res.error);
            }
          }}
        />
      )}
    </div>
  );
}
