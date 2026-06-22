import { create } from 'zustand';

interface UIState {
  activeSpaceId: string | null;
  isSpaceZoomed: boolean;
  setSpaceState: (id: string | null, isZoomed: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeSpaceId: null,
  isSpaceZoomed: false,
  setSpaceState: (id, isZoomed) => set({ activeSpaceId: id, isSpaceZoomed: isZoomed }),
}));
