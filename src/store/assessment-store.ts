import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AssessmentState {
  /** Current question index within the active module */
  currentIndex: Record<number, number>
  /** Draft answers: module -> questionId -> value */
  draftAnswers: Record<number, Record<string, number>>
  /** Completed modules */
  completedModules: number[]
  /** Assessment progress (0-6, synced from DB) */
  assessmentProgress: number

  setAnswer: (module: number, questionId: string, value: number) => void
  setCurrentIndex: (module: number, index: number) => void
  completeModule: (module: number) => void
  clearDraft: (module: number) => void
  setAssessmentProgress: (progress: number) => void
  getModuleAnswers: (module: number) => Record<string, number>
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      currentIndex: {},
      draftAnswers: {},
      completedModules: [],
      assessmentProgress: 0,

      setAnswer: (module, questionId, value) =>
        set((state) => ({
          draftAnswers: {
            ...state.draftAnswers,
            [module]: {
              ...state.draftAnswers[module],
              [questionId]: value,
            },
          },
        })),

      setCurrentIndex: (module, index) =>
        set((state) => ({
          currentIndex: { ...state.currentIndex, [module]: index },
        })),

      completeModule: (module) =>
        set((state) => ({
          completedModules: state.completedModules.includes(module)
            ? state.completedModules
            : [...state.completedModules, module].sort((a, b) => a - b),
        })),

      clearDraft: (module) =>
        set((state) => {
          const { [module]: _, ...rest } = state.draftAnswers
          const { [module]: __, ...restIndex } = state.currentIndex
          return { draftAnswers: rest, currentIndex: restIndex }
        }),

      setAssessmentProgress: (progress) =>
        set({ assessmentProgress: progress }),

      getModuleAnswers: (module) => get().draftAnswers[module] ?? {},
    }),
    {
      name: 'ciq-assessment',
      partialize: (state) => ({
        currentIndex: state.currentIndex,
        draftAnswers: state.draftAnswers,
        completedModules: state.completedModules,
        assessmentProgress: state.assessmentProgress,
      }),
    }
  )
)
