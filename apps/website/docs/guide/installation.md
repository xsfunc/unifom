# Install UniFom

First, you need to install Unifom base package and its peer dependency:

with `pnpm`

```sh
pnpm add @unifom/core effector
```

with `npm`

```sh
npm install @unifom/core effector
```

with `yarn`

```sh
yarn add @unifom/core effector
```

:::info
Unifom declares Effector as a peer dependency to prevent two instances of Effector in the same application.
:::

Actually, that is all what you need to start, but consider installing one of the following integrations to improve your DX with popular tools:

- [`@unifom/react`](/integrations/react) with delicious helpers for React
