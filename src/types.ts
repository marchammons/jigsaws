export interface State {
  sketch?: Sketch
  cutVisible: boolean
  cutNoiseSeeds: string[]
  designVisible: boolean
  designNoiseSeeds: string[]
  pending: ActionType[]
  error?: {
    message?: string
  }
}

export enum ExportPart {
  Cut = 'cut',
  Design = 'design',
  Canvas = 'canvas',
}

export enum ActionType {
  AddPending = 'ADD_PENDING',
  RemovePending = 'REMOVE_PENDING',
  LoadSketch = 'LOAD_SKETCH',
  LoadSketchError = 'LOAD_SKETCH_ERROR',
  ToggleVisibility = 'TOGGLE_VISIBILITY',
  UpdateSeed = 'UPDATE_SEED',
  ExportCut = 'EXPORT_CUT',
  ExportDesign = 'EXPORT_DESIGN',
  ExportCanvas = 'EXPORT_CANVAS',
}

export interface Action {
  type: string
  payload: any
}

export type Thunk = (dispatch: React.Dispatch<Action>, state: State) => void

export type AugmentedDispatch = React.Dispatch<Thunk | Action>

export enum Layer {
  Cut = 'cut',
  Design = 'design',
}

export interface SketchSettings {
  width: number
  height: number
  bleed: number
  rows?: number
  columns?: number
  lineColor: string
  backgroundColor: string
  cutNoiseSeeds: number
  designNoiseSeeds: number
}

export interface Sketch {
  id: string
  design: any
  cut: any
  settings: SketchSettings
}

export interface Cut {
  c: CanvasRenderingContext2D
  width: number
  height: number
  rows: number
  columns: number
  seed: string[]
}
