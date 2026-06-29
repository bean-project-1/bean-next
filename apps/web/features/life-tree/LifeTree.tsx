'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { TreeData, Branch as BranchData } from './types';
import { Branch } from './Branch';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LogOut, Trash2, Shield, User } from 'lucide-react';
import { deleteSpace, leaveSpace, updateMemberRole, generateInviteLink } from '../spaces/actions/spaces';

interface LifeTreeProps {
  data: TreeData;
  onLeafClick?: (leafId: string) => void;
  onScoreClick?: () => void;
  onBranchClick?: (branch: BranchData) => void;
  onRefresh?: () => void;
  onDeleteBranch?: (branch: BranchData) => void;
  onEditBranch?: (branch: BranchData | null) => void;
  onPhaseClick?: (phaseId: string | null) => void;
  onTrunkClick?: () => void;
  activePhaseId?: string | null;
  activeLeafId?: string | null;
  activeBranchId?: string | null;
  isInteractive?: boolean;
  spaceName?: string;
  isZoomed?: boolean;
  onBackToForest?: () => void;
  space?: any;
  onSpaceDeleted?: () => void;
  isActive?: boolean;
}

export const LifeTree = ({ data, onLeafClick, onScoreClick, onBranchClick, onRefresh, onDeleteBranch, onEditBranch, onPhaseClick, onTrunkClick, activePhaseId, activeLeafId, activeBranchId, isInteractive = true, spaceName, isZoomed = false, onBackToForest, space, onSpaceDeleted, isActive = true }: LifeTreeProps) => {
  const router = useRouter();
  const [hoveredLeafName, setHoveredLeafName] = useState<string | null>(null);
  const [clickedLeafId, setClickedLeafId] = useState<string | null>(null);
  const [zoomedBranchId, setZoomedBranchId] = useState<string | null>(null);
  const [zoomedPhaseId, setZoomedPhaseId] = useState<string | null>(null);
  const [isCameraMoving, setIsCameraMoving] = useState(false);
  const [isGoalListOpen, setIsGoalListOpen] = useState(false);
  const [activeTrunkTab, setActiveTrunkTab] = useState<'metas' | 'compartir'>('metas');
  const [isDesktop, setIsDesktop] = useState(false);

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);

  useEffect(() => {
    if (!isGoalListOpen) {
      setInviteLink(null);
      setCopied(false);
      setShowConfirm(false);
      setActionLoading(false);
      setLoadingInvite(false);
    }
  }, [isGoalListOpen]);

  const handleGenerate = async () => {
    if (!space?.id) return;
    setLoadingInvite(true);
    try {
      const token = await generateInviteLink(space.id);
      const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : '';
      setInviteLink(`${origin}/join/${token}`);
    } catch (e) {
      console.error(e);
      alert('Error al generar la invitación');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleCopy = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share && inviteLink) {
      try {
        await navigator.share({
          title: `Únete a mi árbol: ${spaceName}`,
          text: `Te invito a colaborar en "${spaceName}" dentro de Bean.`,
          url: inviteLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleLeaveOrDelete = async () => {
    if (!space?.id) return;
    setActionLoading(true);
    try {
      const role = space.role;
      const isOwner = role === 'owner';
      if (isOwner) {
        await deleteSpace(space.id);
      } else {
        await leaveSpace(space.id);
      }
      onSpaceDeleted?.();
    } catch (e: any) {
      alert('Error: ' + e.message);
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (targetUserId: string, currentRole: string) => {
    if (!space?.id) return;
    const role = space.role;
    const isOwner = role === 'owner';
    if (!isOwner) return;
    const newRole = currentRole === 'owner' ? 'member' : 'owner';
    try {
      await updateMemberRole(space.id, targetUserId, newRole);
      alert('Rol actualizado con éxito. El cambio se reflejará al recargar.');
    } catch (e: any) {
      alert('Error al cambiar rol: ' + e.message);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const trunkRef = useRef<SVGGElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const treeGroupRef = useRef<SVGGElement>(null);

  // We adjust the initial viewBox to 1000x1000 to ensure wide branches and labels are never cut off by SVG boundaries.
  const [viewBox, setViewBox] = useState({ x: -50, y: -100, w: 900, h: 900 });
  const [rotation, setRotation] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const panDistance = useRef(0);
  
  const viewBoxRef = useRef({ x: -50, y: -100, w: 900, h: 900 });
  const activePointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchViewBoxRef = useRef<any>(null);

  useEffect(() => {
    viewBoxRef.current = viewBox;
  }, [viewBox]);

  const prevBranchCount = useRef<number>(data?.branches?.length || 0);
  const hasInitialDataRef = useRef<boolean>(!!data?.branches);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (mounted && data?.branches) {
      if (!hasInitialDataRef.current) {
        // Initial load of data, skip animation
        prevBranchCount.current = data.branches.length;
        hasInitialDataRef.current = true;
      } else {
        // Update the previous count after a short delay so animation has time to read it
        const t = setTimeout(() => {
          prevBranchCount.current = data.branches.length;
        }, 500);
        return () => clearTimeout(t);
      }
    }
  }, [data?.branches, mounted]);

  useEffect(() => {
    // Reset view when leaving or entering zoomed-in state
    if (!isZoomed) {
      resetZoom();
    } else {
      // Zoom in slightly on mobile/desktop when entering the tree
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      
      const targetX = isMobile ? 100 : 50;
      const targetY = isMobile ? 80 : -50;
      const targetSize = isMobile ? 600 : 700;

      if (!zoomedBranchId && !zoomedPhaseId) {
        const stateObj = {
          x: viewBox.x,
          y: viewBox.y,
          w: viewBox.w,
          h: viewBox.h
        };

        setIsCameraMoving(true); // Set synchronously to hide labels immediately
        gsap.to(stateObj, {
          x: targetX,
          y: targetY,
          w: targetSize,
          h: targetSize,
          duration: 0.5,
          ease: "power2.out",
          onStart: () => setIsCameraMoving(true),
          onComplete: () => {
            setIsCameraMoving(false);
            setViewBox({ x: targetX, y: targetY, w: targetSize, h: targetSize });
          },
          onUpdate: () => {
            if (svgRef.current) {
              svgRef.current.setAttribute('viewBox', `${stateObj.x} ${stateObj.y} ${stateObj.w} ${stateObj.h}`);
            }
          }
        });
      }
    }
  }, [isZoomed]);

  // When the branch detail panel is closed externally (activeBranchId → null),
  // reset the camera back to the full tree view.
  useEffect(() => {
    if (activeBranchId === null || activeBranchId === undefined) {
      if (zoomedBranchId !== null) {
        resetZoom();
      }
    }
  }, [activeBranchId]);

  useGSAP(() => {
    const tl = gsap.timeline();
    // 1. Initial UI fade-ins
    if (scoreRef.current) {
      tl.fromTo(scoreRef.current, 
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
    }
  }, { scope: containerRef });
  const handleBranchClick = (branch: BranchData) => {
    onEditBranch?.(branch); // Always trigger the UI to open the panel
    
    if (zoomedBranchId !== branch.id) {
      setZoomedBranchId(branch.id);
      
      const startAngle = -160;
      const endAngle = -20;
      const index = data.branches.findIndex(b => b.id === branch.id);
      const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
      const angle = startAngle + index * step;
      
      // Sync with Branch.tsx lengths
      const length = 180 + (branch.progress / 100) * 100;
      
      // Calculate the maximum extension of any sub-branch (phase) including its activities and subtask leaves
      const phases = branch.leaves.filter(l => l.type === 'phase');
      let maxPhaseExtension = 0;
      
      phases.forEach(phase => {
        const activities = branch.leaves.filter(l => l.parentId === phase.id);
        const activityCount = activities.length;
        const subLen = 40 + activityCount * 8; // Sync with Branch.tsx
        
        let maxSsLen = 0;
        activities.forEach(act => {
          if (act.tasks && act.tasks.length > 0) {
            const ssLen = 25 + act.tasks.length * 8; // Sync with Branch.tsx
            if (ssLen > maxSsLen) {
              maxSsLen = ssLen;
            }
          }
        });
        
        const phaseExtension = subLen + maxSsLen;
        if (phaseExtension > maxPhaseExtension) {
          maxPhaseExtension = phaseExtension;
        }
      });
      
      // Also check orphan activities that grow directly from the branch
      const orphans = branch.leaves.filter(l => l.type !== 'phase' && !l.parentId);
      let maxOrphanSsLen = 0;
      orphans.forEach(orphan => {
        if (orphan.tasks && orphan.tasks.length > 0) {
          const ssLen = 25 + orphan.tasks.length * 8;
          if (ssLen > maxOrphanSsLen) {
            maxOrphanSsLen = ssLen;
          }
        }
      });
      
      const maxSubLen = Math.max(maxPhaseExtension, maxOrphanSsLen);
      
      // Compute the effective height of the branch structure including nested sub-activities
      const leafMargin = 75; // Increased margin for leaves and hover effects
      const mainHeight = length + leafMargin;
      const subHeight = length * 0.85 + maxSubLen * 0.96 + leafMargin;
      const branchHeight = Math.max(mainHeight, subHeight);
      
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
      
      let targetX, targetY, zoomSize, targetRot;
      
      if (isMobile) {
        targetRot = 0;
        zoomSize = branchHeight * 1.55;
        const rad = (angle * Math.PI) / 180;
        const midX = 400 + Math.cos(rad) * (branchHeight * 0.5);
        const midY = 350 + Math.sin(rad) * (branchHeight * 0.5);
        targetX = midX - zoomSize / 2;
        targetY = midY - zoomSize * 0.15; // Shift up slightly to avoid bottom sheet overlap
      } else {
        targetRot = -90 - angle;
        // Pivot is (400, 350). Since we rotate around it, the pivot's position doesn't change relative to the SVG.
        // We want (400, 350) to be at the bottom-center of the zoomed view.
        zoomSize = branchHeight * 1.45;
        // Desktop: Shift camera right by 20% (branch moves left).
        targetX = (400 - zoomSize / 2) + (zoomSize * 0.2);
        // Desktop: Center Y by placing the base pivot at 78% height
        targetY = 350 - zoomSize * 0.78;
      }

      const stateObj = {
        x: viewBox.x,
        y: viewBox.y,
        w: viewBox.w,
        h: viewBox.h,
        r: rotation
      };

      // Normalize target rotation to shortest path
      const currentRot = rotation;
      const diff = ((targetRot - currentRot + 180) % 360 + 360) % 360 - 180;
      targetRot = currentRot + diff;

      setIsCameraMoving(true);
      gsap.to(stateObj, {
        x: targetX,
        y: targetY,
        w: zoomSize,
        h: zoomSize,
        r: targetRot,
        duration: 0.45,
        ease: "power2.out",
        onStart: () => setIsCameraMoving(true),
        onComplete: () => {
          setIsCameraMoving(false);
          setViewBox({ x: targetX, y: targetY, w: zoomSize, h: zoomSize });
          setRotation(targetRot);
        },
        onUpdate: () => {
          if (svgRef.current) {
            svgRef.current.setAttribute('viewBox', `${stateObj.x} ${stateObj.y} ${stateObj.w} ${stateObj.h}`);
          }
          if (treeGroupRef.current) {
            treeGroupRef.current.setAttribute('transform', `rotate(${stateObj.r}, 400, 350)`);
          }
        }
      });
    }
    onBranchClick?.(branch);
  };

  const handlePhaseClick = (phaseId: string, x: number, y: number, angle?: number, startX?: number, startY?: number, branchId?: string, len?: number) => {
    onPhaseClick?.(phaseId); // Always sync with sidebar
    if (branchId) {
      const branch = data.branches.find(b => b.id === branchId);
      if (branch) onEditBranch?.(branch); // Always trigger management UI
    }

    if (zoomedPhaseId === phaseId) {
      setZoomedPhaseId(null);
      const branch = data.branches.find(b => b.id === zoomedBranchId);
      if (branch) handleBranchClick(branch);
    } else {
      setZoomedPhaseId(phaseId);
      
      // If we clicked directly from full tree, we must also set the zoomed branch
      if (branchId && zoomedBranchId !== branchId) {
        setZoomedBranchId(branchId);
      }

      if (angle !== undefined && startX !== undefined && startY !== undefined) {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        
        // Calculate dynamic height of this phase including its nested activities and subtask leaves
        let phaseHeight = len || 100;
        if (branchId && phaseId) {
          const branch = data.branches.find(b => b.id === branchId);
          if (branch) {
            const phase = branch.leaves.find(l => l.id === phaseId);
            if (phase) {
              const activities = branch.leaves.filter(l => l.parentId === phase.id);
              const activityCount = activities.length;
              const subLen = 40 + activityCount * 8; // Sync with Branch.tsx
              
              let maxSsLen = 0;
              activities.forEach(act => {
                if (act.tasks && act.tasks.length > 0) {
                  const ssLen = 25 + act.tasks.length * 8; // Sync with Branch.tsx
                  if (ssLen > maxSsLen) {
                    maxSsLen = ssLen;
                  }
                }
              });
              phaseHeight = subLen + maxSsLen;
            }
          }
        }
        
        let targetX, targetY, zoomSize, targetRot;
        
        if (isMobile) {
          targetRot = 0;
          zoomSize = phaseHeight * 2.7; // Generous height for mobile view
          const midX = (startX + x) / 2;
          const midY = (startY + y) / 2;
          targetX = midX - zoomSize / 2;
          targetY = midY - zoomSize * 0.15;
        } else {
          const angleDeg = (angle * 180) / Math.PI;
          targetRot = -90 - angleDeg;
          
          // Focus area
          zoomSize = phaseHeight * 2.4; // Increased from 1.9 / 2.3 to give plenty of room for all subtask leaves
          
          const targetRad = (targetRot * Math.PI) / 180;
          const px = 400, py = 350;
          
          const rx = Math.cos(targetRad) * (startX - px) - Math.sin(targetRad) * (startY - py) + px;
          const ry = Math.sin(targetRad) * (startX - px) + Math.cos(targetRad) * (startY - py) + py;

          // Desktop: Shift camera right by 20% (phase moves left).
          targetX = (rx - zoomSize / 2) + (zoomSize * 0.2);
          // Desktop: Center Y by placing the base of the phase branch at 78% height
          targetY = ry - zoomSize * 0.78;
        }

        const stateObj = {
          x: viewBox.x,
          y: viewBox.y,
          w: viewBox.w,
          h: viewBox.h,
          r: rotation
        };

        const currentRot = rotation;
        const diff = ((targetRot - currentRot + 180) % 360 + 360) % 360 - 180;
        targetRot = currentRot + diff;

        setIsCameraMoving(true);
        gsap.to(stateObj, {
          x: targetX,
          y: targetY,
          w: zoomSize,
          h: zoomSize,
          r: targetRot,
          duration: 0.45,
          ease: "power2.out",
          onStart: () => setIsCameraMoving(true),
          onComplete: () => {
            setIsCameraMoving(false);
            setViewBox({ x: targetX, y: targetY, w: zoomSize, h: zoomSize });
            setRotation(targetRot);
          },
          onUpdate: () => {
            if (svgRef.current) {
              svgRef.current.setAttribute('viewBox', `${stateObj.x} ${stateObj.y} ${stateObj.w} ${stateObj.h}`);
            }
            if (treeGroupRef.current) {
              treeGroupRef.current.setAttribute('transform', `rotate(${stateObj.r}, 400, 350)`);
            }
          }
        });
      }
    }
  };

  const resetZoom = () => {
    setZoomedBranchId(null);
    setZoomedPhaseId(null);
    setIsGoalListOpen(false); // Close trunk menu if open
    onEditBranch?.(null); // Notify parent to close the branch panel
    onPhaseClick?.(null); // Clear phase selection

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    const targetX = isMobile 
      ? (isZoomed ? 100 : 0) 
      : (isZoomed ? 50 : -50);
      
    const targetY = isMobile 
      ? (isZoomed ? 80 : -75) 
      : (isZoomed ? -50 : -100);
      
    const targetSize = isMobile 
      ? (isZoomed ? 600 : 800) 
      : (isZoomed ? 700 : 900);

    const stateObj = {
      x: viewBox.x,
      y: viewBox.y,
      w: viewBox.w,
      h: viewBox.h,
      r: rotation
    };

    // Normalize current rotation so it always takes the shortest path to 0
    let currentRot = rotation;
    const diff = ((0 - currentRot + 180) % 360 + 360) % 360 - 180;
    const targetRot = currentRot + diff;

    setIsCameraMoving(true);
    gsap.to(stateObj, {
      x: targetX,
      y: targetY,
      w: targetSize,
      h: targetSize,
      r: targetRot,
      duration: 0.5,
      ease: "power2.out",
      onStart: () => setIsCameraMoving(true),
      onComplete: () => {
        setIsCameraMoving(false);
        setViewBox({ x: targetX, y: targetY, w: targetSize, h: targetSize });
        setRotation(0);
      },
      onUpdate: () => {
        if (svgRef.current) {
          svgRef.current.setAttribute('viewBox', `${stateObj.x} ${stateObj.y} ${stateObj.w} ${stateObj.h}`);
        }
        if (treeGroupRef.current) {
          treeGroupRef.current.setAttribute('transform', `rotate(${stateObj.r}, 400, 350)`);
        }
      }
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isInteractive || !isZoomed) return;
    e.preventDefault();
    const zoomFactor = 1.05; // Smoother manual zoom step
    const factor = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;
    
    const newW = Math.max(100, Math.min(2000, viewBox.w * factor));
    const newH = Math.max(100, Math.min(2000, viewBox.h * factor));
    
    // If scrolling out while focused on a branch
    if (zoomedBranchId && e.deltaY > 0) {
      // 1. Auto-reset completely if they zoom out wide enough
      if (newW >= 650) {
        resetZoom();
        return;
      }
      
      // 2. Smoothly "relax" the rotation towards upright (0 degrees)
      const currentRot = rotation;
      const diff = ((0 - currentRot + 180) % 360 + 360) % 360 - 180;
      // Move 10% towards zero per scroll tick
      setRotation(currentRot + (diff * 0.1));
    }

    const dx = (viewBox.w - newW) / 2;
    const dy = (viewBox.h - newH) / 2;

    setViewBox({
      x: viewBox.x + dx,
      y: viewBox.y + dy,
      w: newW,
      h: newH
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive || !isZoomed) return;
    
    // Add pointer to active pointers map
    activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    
    if (e.pointerType === 'mouse' && e.button !== 0) return; // Only left click for pan if using mouse

    if (activePointersRef.current.size === 1) {
      setIsPanning(true);
      panStart.current = { x: e.clientX, y: e.clientY };
      panDistance.current = 0;
    } else if (activePointersRef.current.size === 2) {
      // Pinch to zoom starts, stop panning
      setIsPanning(false);
      const keys = Array.from(activePointersRef.current.keys());
      const p1 = activePointersRef.current.get(keys[0])!;
      const p2 = activePointersRef.current.get(keys[1])!;
      
      const dist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      initialPinchDistRef.current = dist;
      initialPinchViewBoxRef.current = { ...viewBoxRef.current };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Update pointer position in map
    if (activePointersRef.current.has(e.pointerId)) {
      activePointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    if (e.pointerType === 'mouse') {
      setMousePos({ x: e.clientX, y: e.clientY });
    }

    if (!isZoomed || !isInteractive) return;

    if (activePointersRef.current.size === 1 && isPanning) {
      const rawDx = e.clientX - panStart.current.x;
      const rawDy = e.clientY - panStart.current.y;
      panDistance.current += Math.sqrt(rawDx * rawDx + rawDy * rawDy);

      const rect = svgRef.current?.getBoundingClientRect();
      let dx = 0;
      let dy = 0;
      if (rect) {
        const scaleX = rect.width / viewBoxRef.current.w;
        const scaleY = rect.height / viewBoxRef.current.h;
        const scale = Math.min(scaleX, scaleY);
        
        dx = rawDx / scale;
        dy = rawDy / scale;
      } else {
        dx = rawDx * (viewBoxRef.current.w / 800);
        dy = rawDy * (viewBoxRef.current.h / 800);
      }

      const nextX = viewBoxRef.current.x - dx;
      const nextY = viewBoxRef.current.y - dy;

      viewBoxRef.current = {
        ...viewBoxRef.current,
        x: nextX,
        y: nextY
      };

      if (svgRef.current) {
        svgRef.current.setAttribute('viewBox', `${nextX} ${nextY} ${viewBoxRef.current.w} ${viewBoxRef.current.h}`);
      }

      panStart.current = { x: e.clientX, y: e.clientY };

    } else if (activePointersRef.current.size === 2 && initialPinchDistRef.current && initialPinchViewBoxRef.current) {
      const keys = Array.from(activePointersRef.current.keys());
      const p1 = activePointersRef.current.get(keys[0])!;
      const p2 = activePointersRef.current.get(keys[1])!;
      
      const currentDist = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
      if (currentDist === 0 || initialPinchDistRef.current === 0) return;

      const factor = initialPinchDistRef.current / currentDist;
      
      const initVB = initialPinchViewBoxRef.current;
      const newW = Math.max(100, Math.min(2000, initVB.w * factor));
      const newH = Math.max(100, Math.min(2000, initVB.h * factor));

      const midScreenX = (p1.x + p2.x) / 2;
      const midScreenY = (p1.y + p2.y) / 2;

      const rect = svgRef.current?.getBoundingClientRect();
      if (rect) {
        const svgScaleX = rect.width / initVB.w;
        const svgScaleY = rect.height / initVB.h;
        const svgScale = Math.min(svgScaleX, svgScaleY);

        const midSvgX = initVB.x + (midScreenX - rect.left) / svgScale;
        const midSvgY = initVB.y + (midScreenY - rect.top) / svgScale;

        const nextScaleX = rect.width / newW;
        const nextScaleY = rect.height / newH;

        const nextX = midSvgX - (midScreenX - rect.left) / nextScaleX;
        const nextY = midSvgY - (midScreenY - rect.top) / nextScaleY;

        viewBoxRef.current = {
          x: nextX,
          y: nextY,
          w: newW,
          h: newH
        };

        if (svgRef.current) {
          svgRef.current.setAttribute('viewBox', `${nextX} ${nextY} ${newW} ${newH}`);
        }
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    activePointersRef.current.delete(e.pointerId);

    if (activePointersRef.current.size === 0) {
      const wasPanning = isPanning;
      setIsPanning(false);
      initialPinchDistRef.current = null;
      initialPinchViewBoxRef.current = null;

      // Sync React state on final release
      setViewBox(viewBoxRef.current);

      if (wasPanning && isZoomed && panDistance.current < 5) {
        if (e.target === svgRef.current) {
          resetZoom();
        }
      }
    } else if (activePointersRef.current.size === 1) {
      // Re-initialize panning with remaining finger
      const remainingId = Array.from(activePointersRef.current.keys())[0];
      const remainingPos = activePointersRef.current.get(remainingId)!;
      
      setIsPanning(true);
      panStart.current = { x: remainingPos.x, y: remainingPos.y };
      panDistance.current = 0;
      initialPinchDistRef.current = null;
      initialPinchViewBoxRef.current = null;
    }
  };

  const handleLeafClickHandler = (id: string, name: string) => {
    setClickedLeafId(id === clickedLeafId ? null : id);
    onLeafClick?.(id);
  };

  const getQualitativeState = (score: number) => {
    if (score < 30) return 'Brotando';
    if (score < 70) return 'Creciendo';
    return 'Floreciendo';
  };

  const lifeState = getQualitativeState(data.growthScore);

  // Note: We use CSS transitions based on zoomedBranchId instead of dynamicOpacity
  // so manual mouse wheel scrolling doesn't accidentally fade out the tree.

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full bg-transparent font-sans overflow-hidden z-10">
      <svg
        ref={svgRef}
        viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
        className={`w-full h-full ${isInteractive ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-auto'} ${(isCameraMoving || isPanning) ? 'no-sway' : ''}`}
        style={{ touchAction: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <defs>
          <style>{`
            @keyframes leafSway {
              0%, 100% {
                transform: rotate(0deg);
              }
              50% {
                transform: rotate(var(--sway-deg, 5deg));
              }
            }
            .no-sway .sway-leaf {
              animation: none !important;
            }
          `}</style>
          {/* Wood gradient: darker edges, exact branch color #7c4a1e in the center */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4c270d" />
            <stop offset="35%" stopColor="#7c4a1e" />
            <stop offset="65%" stopColor="#7c4a1e" />
            <stop offset="100%" stopColor="#4c270d" />
          </linearGradient>
          {/* Soft center highlight */}
          <linearGradient id="trunkSheen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="rgba(255,210,160,0.12)" />
            <stop offset="60%" stopColor="rgba(255,210,160,0.12)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Grass gradient for the base mound */}
          <linearGradient id="grassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="60%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>

          {/* Seed Gradient: Organic Emerald Glow */}
          <radialGradient id="seedGrad" cx="50%" cy="50%" r="50%" fx="35%" fy="35%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="70%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#065f46" />
          </radialGradient>

          {/* Standard Leaf Gradient */}
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </linearGradient>

          {/* Fruit Gradient: Completed (Gold/Orange) */}
          <linearGradient id="fruitGrad-completed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>

          {/* Fruit Gradient: Incomplete (Gray) */}
          <linearGradient id="fruitGrad-incomplete" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          
         </defs>

        <g ref={treeGroupRef} transform={`rotate(${rotation}, 400, 350)`}>
          {/* 1. Grassy Mound Base (Background Layer) */}
          {!zoomedBranchId && (
            <>
              {/* Soft ground shadow */}
              <ellipse cx="400" cy="458" rx="80" ry="14" fill="#0f172a" opacity="0.1" filter="blur(5px)" />
              {/* Background Grass Mound - Organic Curve */}
              <path d="M 310,455 C 340,447 370,443 400,443 C 430,443 460,447 490,455 C 460,463 430,467 400,467 C 370,467 340,463 310,455 Z" fill="url(#grassGrad)" />
              {/* Highlight on background grass */}
              <path d="M 330,453 C 355,448 375,445 400,445 C 425,445 445,448 470,453 C 445,458 425,461 400,461 C 375,461 355,458 330,453 Z" fill="#34d399" opacity="0.25" filter="blur(1px)" />
            </>
          )}

          {/* 3. Realistic Trunk */}
          <g 
            ref={trunkRef} 
            className={`transition-opacity duration-700 ease-out ${!isInteractive ? 'cursor-pointer origin-bottom' : 'cursor-pointer hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]'}`}
            style={{ opacity: zoomedBranchId ? 0 : 1 }}
            onClick={(e) => {
              if (!isInteractive) return; // Let it bubble up to ForestCarousel!
              e.stopPropagation();
              if (isZoomed) {
                // In tree view: open the tabbed trunk menu
                setActiveTrunkTab('metas');
                setIsGoalListOpen(true);
              } else if (onTrunkClick) {
                onTrunkClick();
              }
            }}
          >
            {/* Natural dome crown joint centered around (400, 350) */}
            <path d="M 370,454 C 380,446 385,410 390,350 C 395,348 405,348 410,350 C 415,410 420,446 430,454 Z" fill="url(#trunkGrad)" />
            <path d="M 370,454 C 380,446 385,410 390,350 C 395,348 405,348 410,350 C 415,410 420,446 430,454 Z" fill="url(#trunkSheen)" />
            
            {/* Foreground Grass Cover (overlaps and buries the trunk base for a natural transition) */}
            <path d="M 362,454 C 375,451 385,450 400,450 C 415,450 425,451 438,454 C 425,458 415,460 400,460 C 385,460 375,458 362,454 Z" fill="url(#grassGrad)" />
            
            {/* Curving organic bark details */}
            <path d="M 380,450 C 383,425 387,400 392,352" stroke="#4c270d" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
            <path d="M 400,452 C 400,425 400,395 400,348" stroke="#4c270d" strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
            <path d="M 420,450 C 417,425 413,400 408,352" stroke="#4c270d" strokeWidth="1" fill="none" opacity="0.35" strokeLinecap="round" />
            <ellipse cx="402" cy="408" rx="5" ry="3.5" fill="#4c270d" opacity="0.25" />
            <ellipse cx="402" cy="408" rx="2.5" ry="1.5" fill="#2d1505" opacity="0.3" />
          </g>



          {/* 7. Tree Name Label (Perfectly aligned below roots) */}
          {spaceName && (
            <text 
              x="400" 
              y="540" 
              textAnchor="middle" 
              className={`text-[42px] font-black uppercase tracking-widest transition-opacity duration-500`}
              style={{ fill: '#1e293b', textShadow: '0px 2px 15px rgba(255,255,255,0.9), 0px -2px 15px rgba(255,255,255,0.9)', opacity: (zoomedBranchId || isCameraMoving) ? 0 : 1 }}
            >
              {spaceName}
            </text>
          )}

          {/* Dynamic Branches */}
          {data.branches.map((branch, i) => {
            const branchOpacity = (zoomedBranchId && zoomedBranchId !== branch.id) ? 0 : 1;

            return (
              <Branch
                key={branch.id}
                branch={branch}
                index={i}
                totalBranches={data.branches.length}
                clickedLeafId={clickedLeafId}
                onClick={handleLeafClickHandler}
                onHover={setHoveredLeafName}
                onBranchClick={handleBranchClick}
                onPhaseClick={handlePhaseClick}
                onEdit={onEditBranch}
                onDelete={onDeleteBranch}
                isZoomed={zoomedBranchId === branch.id}
                opacity={branchOpacity}
                zoomedPhaseId={zoomedBranchId === branch.id ? zoomedPhaseId : null}
                activeLeafId={activeLeafId}
                activePhaseId={activePhaseId}
                isInteractive={isInteractive}
                animate={i >= prevBranchCount.current}
                simplified={!isActive && !isZoomed}
                isMobile={!isDesktop}
              />
            );
          })}

          {/* Branch Labels inside SVG - Zoom Resilient */}
          {data.branches.map((branch, i) => {
            const startAngle = -160;
            const endAngle = -20;
            const step = data.branches.length > 1 ? (endAngle - startAngle) / (data.branches.length - 1) : 0;
            const angle = startAngle + i * step;
            const length = 240 + (branch.progress / 100) * 150; // Sync with Branch.tsx
            const rad = (angle * Math.PI) / 180;
            const endX = 400 + Math.cos(rad) * length;
            const endY = 350 + Math.sin(rad) * length;
            
            let labelOpacity = 1;
            if (!isZoomed || isCameraMoving) {
              labelOpacity = 0;
            } else if (zoomedBranchId !== null) {
              const threshold = 600;
              const range = 800 - threshold;
              labelOpacity = Math.max(0, Math.min(1, (viewBox.w - threshold) / range));
            }

            if (labelOpacity <= 0) return null;

            // Split long names into lines
            const words = branch.goal.split(' ');
            const lines: string[] = [];
            let currentLine = '';
            
            // Use narrower text blocks on mobile so they don't hit the screen edges
            const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
            const maxChars = isMobile ? 12 : 20;

            words.forEach(word => {
              if ((currentLine + word).length > maxChars) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word + ' ';
              } else {
                currentLine += word + ' ';
              }
            });
            if (currentLine) lines.push(currentLine.trim());

            return (
              <g 
                key={`label-${branch.id}`} 
                className="pointer-events-none transition-opacity duration-300" 
                style={{ opacity: labelOpacity }}
                transform={`rotate(${-rotation}, ${endX}, ${endY})`}
              >
                <text 
                  x={endX + (endX > 400 ? 15 : -15)} 
                  y={endY - (lines.length - 1) * 6} 
                  textAnchor={endX > 400 ? "start" : "end"} 
                  dominantBaseline="middle"
                  className="text-[11px] font-black fill-slate-600 uppercase tracking-tight"
                  style={{ textShadow: '0px 2px 4px rgba(255,255,255,0.9), 0px -2px 4px rgba(255,255,255,0.9), 2px 0px 4px rgba(255,255,255,0.9), -2px 0px 4px rgba(255,255,255,0.9), 0px 0px 8px rgba(255,255,255,1)' }}
                >
                  {lines.map((line, lIdx) => (
                    <tspan 
                      key={lIdx} 
                      x={endX + (endX > 400 ? 15 : -15)} 
                      dy={lIdx === 0 ? 0 : 12}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              </g>
            );
          })}
        </g>

      </svg>

      {/* Interaction Hints - Floating Cursor Tooltip */}
      {mounted && hoveredLeafName && (typeof window !== 'undefined' && window.innerWidth >= 640) && createPortal(
        <div 
          className="fixed pointer-events-none bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-2xl border border-slate-100 z-[9999] animate-in fade-in zoom-in duration-200"
          style={{ 
            left: mousePos.x + 20, 
            top: mousePos.y + 20,
            maxWidth: '280px'
          }}
        >
          <p className="text-slate-700 font-bold tracking-tight text-xs leading-snug">
            {hoveredLeafName}
          </p>
        </div>,
        document.body
      )}

      {mounted && isZoomed && createPortal(
        <button
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (zoomedBranchId || zoomedPhaseId) {
              // Zoomed into a branch → go back to full tree view
              resetZoom();
            } else {
              // Full tree view → go back to the forest (close everything first)
              resetZoom();
              onBackToForest?.();
            }
          }}
          className="fixed top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 px-5 py-2.5 bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md rounded-full shadow-lg border border-white/10 font-bold transition-all z-40 animate-in fade-in slide-in-from-top-4 active:scale-95 text-xs sm:text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          {zoomedBranchId || zoomedPhaseId ? 'Volver al Árbol' : 'Volver al Bosque'}
        </button>,
        document.body
      )}

      {mounted && isZoomed && createPortal(
        <AnimatePresence>
          {isGoalListOpen && (
            <div className="fixed inset-0 z-[99990] flex items-end md:items-center justify-center p-0 md:p-6 overflow-hidden pointer-events-auto">
              {/* Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm pointer-events-auto"
                onClick={() => setIsGoalListOpen(false)}
              />
              {/* Modal Container */}
              <motion.div 
                initial={isDesktop ? { scale: 0.95, opacity: 0 } : { y: '100%' }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={isDesktop ? { scale: 0.95, opacity: 0 } : { y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className={`relative w-full flex flex-col overflow-hidden bg-[#FAF9F6] text-stone-850 shadow-2xl border-t md:border border-[#E6E1D6] transition-all duration-300 ${
                  isDesktop ? 'md:max-w-xl md:h-[65vh] md:rounded-[32px] md:self-center' : 'h-[75dvh] rounded-t-[32px]'
                }`}
                onClick={e => e.stopPropagation()}
              >
                {/* Accent line at the very top representing the trunk */}
                <div className="h-1.5 w-full shrink-0 bg-gradient-to-r from-[#A0522D] to-[#8B5A2B]" />

                {/* Handle for mobile */}
                <div className="shrink-0 flex justify-center pt-3 pb-1 md:hidden">
                  <div className="w-12 h-1.5 bg-[#E6E1D6] hover:bg-stone-300 transition-colors rounded-full" />
                </div>

                {/* Title and close button bar */}
                <div className="shrink-0 px-5 pt-4 pb-3 flex items-center justify-between">
                  <h3 className="text-sm font-black text-[#5C4033] uppercase tracking-wider">
                    Tronco Principal
                  </h3>
                  <button
                    onClick={() => setIsGoalListOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#E6E1D6]/40 hover:bg-[#E6E1D6]/70 text-[#5c4033] flex items-center justify-center transition-colors"
                    title="Cerrar"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                {/* Tab switcher */}
                <div className="shrink-0 flex gap-2 mx-5 mb-4 bg-[#F4F1EA] border border-[#E6E1D6] p-1 rounded-2xl">
                  <button
                    onClick={() => setActiveTrunkTab('metas')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTrunkTab === 'metas'
                        ? 'bg-white text-[#A0522D] shadow-sm border border-[#EAD4C5]'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    🌿 Metas
                  </button>
                  <button
                    onClick={() => setActiveTrunkTab('compartir')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      activeTrunkTab === 'compartir'
                        ? 'bg-white text-[#A0522D] shadow-sm border border-[#EAD4C5]'
                        : 'text-stone-500 hover:text-stone-700'
                    }`}
                  >
                    🤝 Compartir
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto px-5 pb-8 custom-scrollbar">
                  {activeTrunkTab === 'metas' && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-3">
                        {data.branches.length} Meta{data.branches.length !== 1 ? 's' : ''} · {spaceName || 'Mi Árbol'}
                      </p>
                      {data.branches.length === 0 ? (
                        <div className="flex flex-col items-center py-10 gap-3 text-center">
                          <span className="text-4xl">🌱</span>
                          <p className="text-stone-500 text-sm font-medium">Este árbol no tiene metas plantadas aún.</p>
                        </div>
                      ) : (
                        data.branches.map((branch) => {
                          const isActive = zoomedBranchId === branch.id;
                          const pct = Math.round(branch.progress);
                          return (
                            <button
                              key={branch.id}
                              onClick={() => {
                                handleBranchClick(branch);
                                setIsGoalListOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all active:scale-[0.98] ${
                                isActive
                                  ? 'border-[#1B7A4E] bg-emerald-50 text-emerald-950 shadow-xs'
                                  : 'bg-white border-[#E6E1D6]/70 hover:border-[#1B7A4E]/30 hover:bg-[#FAF9F6] text-stone-800'
                              }`}
                            >
                              {/* Progress ring */}
                              <div className="relative shrink-0 w-10 h-10">
                                <svg viewBox="0 0 36 36" className="w-10 h-10 -rotate-90">
                                  <circle cx="18" cy="18" r="15" fill="none" stroke="#E6E1D6" strokeWidth="3"/>
                                  <circle cx="18" cy="18" r="15" fill="none"
                                    stroke={isActive ? '#1B7A4E' : '#22c55e'}
                                    strokeWidth="3"
                                    strokeDasharray={`${(pct / 100) * 94.2} 94.2`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span className={`absolute inset-0 flex items-center justify-center text-[9px] font-black ${isActive ? 'text-emerald-900' : 'text-stone-700'}`}>{pct}%</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold line-clamp-2 leading-snug ${isActive ? 'text-emerald-950' : 'text-stone-850'}`}>{branch.goal}</p>
                                <p className={`text-[10px] font-semibold mt-0.5 uppercase tracking-wide ${isActive ? 'text-emerald-700' : 'text-stone-500'}`}>
                                  {branch.leaves?.length || 0} fase{(branch.leaves?.length || 0) !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`}>
                                <path d="M9 18l6-6-6-6"/>
                              </svg>
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}

                  {activeTrunkTab === 'compartir' && (
                    <div className="flex flex-col gap-4 text-stone-850">
                      {space && space.id !== 'personal' ? (
                        <div className="space-y-4">
                          <p className="text-xs text-stone-600 leading-relaxed">
                            Haz crecer este árbol acompañado. Comparte este enlace con tus amigos, socios o pareja para que puedan ver y editar las metas de este espacio.
                          </p>

                          {!inviteLink ? (
                            <button
                              onClick={handleGenerate}
                              disabled={loadingInvite}
                              className="w-full py-3 bg-[#1B7A4E] hover:bg-[#145D3B] text-white font-bold rounded-2xl transition-all disabled:opacity-50 active:scale-95 shadow-sm text-xs sm:text-sm font-sans"
                            >
                              {loadingInvite ? 'Generando...' : 'Generar enlace de invitación'}
                            </button>
                          ) : (
                            <div className="space-y-2">
                              <div className="bg-[#F4F1EA] p-3 rounded-xl border border-[#E6E1D6] flex items-center justify-between gap-2">
                                <span className="text-[#1B7A4E] truncate text-xs font-mono flex-1">{inviteLink}</span>
                                <button
                                  onClick={handleCopy}
                                  className="shrink-0 bg-white hover:bg-stone-50 border border-[#E6E1D6] px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-stone-700"
                                >
                                  {copied ? '¡Copiado!' : 'Copiar'}
                                </button>
                              </div>
                              <button
                                onClick={handleShare}
                                className="w-full py-3 bg-[#1B7A4E] hover:bg-[#145D3B] text-white font-bold rounded-2xl transition-all flex justify-center items-center gap-2 active:scale-95 text-xs sm:text-sm"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <circle cx="18" cy="5" r="3"/>
                                  <circle cx="6" cy="12" r="3"/>
                                  <circle cx="18" cy="19" r="3"/>
                                  <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                                  <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                                </svg>
                                Compartir enlace
                              </button>
                            </div>
                          )}

                          <div className="pt-4 border-t border-[#E6E1D6]">
                            <h4 className="text-xs font-bold text-stone-750 mb-3 flex items-center gap-2">
                              <User className="w-4 h-4 text-[#8B5A2B]" />
                              Miembros del Árbol ({space.membersList?.length || 0})
                            </h4>
                            <div className="space-y-2 mb-4 max-h-[22vh] overflow-y-auto pr-2 custom-scrollbar">
                              {(space.membersList || []).map((member: any) => {
                                const isOwner = space.role === 'owner';
                                return (
                                  <div key={member.userId} className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E6E1D6]/70">
                                    <div className="flex items-center gap-3 min-w-0">
                                      {member.avatarUrl ? (
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                                          <Image src={member.avatarUrl} alt={member.name} fill className="object-cover" />
                                        </div>
                                      ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                                          {member.name?.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="min-w-0">
                                        <p className="text-xs font-bold text-stone-800 truncate">{member.name}</p>
                                        <p className="text-[9px] text-[#A0522D] font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                                          {member.role === 'owner' ? <Shield className="w-2.5 h-2.5 text-[#A0522D]" /> : null}
                                          {member.role === 'owner' ? 'Creador' : 'Miembro'}
                                        </p>
                                      </div>
                                    </div>
                                    {isOwner && member.role !== 'owner' && (
                                      <button 
                                        onClick={() => handleChangeRole(member.userId, member.role)}
                                        className="text-[10px] text-stone-600 hover:text-stone-850 px-2 py-1 rounded-md bg-stone-100 hover:bg-[#E6E1D6]/50 transition-colors"
                                      >
                                        Hacer Creador
                                      </button>
                                    )}
                                    {isOwner && member.role === 'owner' && (space.membersList || []).filter((m: any) => m.role === 'owner').length > 1 && (
                                      <button 
                                        onClick={() => handleChangeRole(member.userId, member.role)}
                                        className="text-[10px] text-stone-600 hover:text-stone-855 px-2 py-1 rounded-md bg-stone-100 hover:bg-[#E6E1D6]/50 transition-colors"
                                      >
                                        Hacer Miembro
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>

                            {showConfirm ? (
                              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center">
                                <p className="text-red-800 text-xs mb-3 font-medium">
                                  {space.role === 'owner'
                                    ? '¿Estás seguro de eliminar este árbol? Se borrarán todas las ramas, metas y chats para todos los miembros.' 
                                    : '¿Estás seguro de que quieres salir de este árbol? Perderás el acceso a todas sus ramas y chat.'}
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setShowConfirm(false)}
                                    className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition-colors font-bold text-xs"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    onClick={handleLeaveOrDelete}
                                    disabled={actionLoading}
                                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-bold text-xs"
                                  >
                                    {actionLoading ? 'Procesando...' : 'Sí, confirmar'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setShowConfirm(true)}
                                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl transition-colors flex justify-center items-center gap-2 border border-red-200/50 text-xs sm:text-sm active:scale-95"
                              >
                                {space.role === 'owner' ? <Trash2 className="w-4 h-4" /> : <LogOut className="w-4 h-4" />}
                                {space.role === 'owner' ? 'Eliminar Árbol (para todos)' : 'Salir del Árbol'}
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl bg-stone-50 border border-[#E6E1D6]/70 flex flex-col items-center gap-3 text-center">
                          <span className="text-4xl">🌳</span>
                          <p className="text-sm font-bold text-stone-700">Este es tu árbol privado</p>
                          <p className="text-xs text-stone-500 leading-relaxed">Puedes crear espacios compartidos para colaborar con otras personas en metas en común.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
};
