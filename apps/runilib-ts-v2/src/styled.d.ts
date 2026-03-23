import 'styled-components'
import type { AppTheme } from './types'

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
