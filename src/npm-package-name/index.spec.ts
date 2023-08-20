import { npmPackageName } from '.'

describe('npm-package-name', () => {
  describe('npmPackageName', () => {
    const fn = npmPackageName

    test('basic test', () => {
      const instance = fn({ a: 1, b: 2 })
      expect(instance).toBe(3)
    })
  })
})
