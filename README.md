# ui-component-starter

A starter for creating a generic component/"package" in typescript.

## Setup

Throughout the starter, the component is called `MyComponent` as a placeholder. Execute `setup.sh` (e.g. `sh setup.sh`) to replace all occurences of `MyComponent` (and `my-component` in some places) with your desired component name.

## Usage

`npm i`

To start hot reloading: `npm start`

Edit a file within `src/component` to observe hot-reloading.

### TS

The typescript for the component should go into `src/component`

## NPM Publishing

1. Ensure that `package.json` has the correct details for the npm package.
2. `npm run build-component`
3. `npm publish`

## Notable Technologies

* typescript
* jest
