import { defineConfig } from 'vitest/config'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [babel({ babelHelpers: 'bundled' })],
})
