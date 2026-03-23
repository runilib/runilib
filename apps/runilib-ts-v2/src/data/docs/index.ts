import type { LibraryDoc } from '../../types'
import { formbridgeDocs } from './formbridge'
import { stepwiseDocs }   from './stepwise'
import { tooltipDocs }    from './tooltip'

export const DOCS: Record<string, LibraryDoc> = {
  formbridge: formbridgeDocs,
  stepwise:   stepwiseDocs,
  tooltip:    tooltipDocs,
}

export { formbridgeDocs, stepwiseDocs, tooltipDocs }
