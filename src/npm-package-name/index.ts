import { NpmPackageNameOptions, NpmPackageName } from './types'

export const npmPackageName = (options: NpmPackageNameOptions): NpmPackageName => (
  options.a + options.b
)
