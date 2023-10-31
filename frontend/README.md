# Senior Design - Commuter Emissions
Shawn, Harris, Justin

# Setup
1. Clone Repo Locally (or fork)
1. Run `npm i` to install all dependencies
1. Create `.env` file with your MapBox API key to be stored
   - use the `.env.example` [file as a reference](./.env.example)
   - create a new `.env` file with the variable named `VITE_MAPBOX_TOKEN` (all env variables must be prefixed with _VITE_)
1. run `npm run dev`


### Resources
- [React Mapbox Wrapper](https://visgl.github.io/react-map-gl/docs/get-started)
- [Figma Designs](https://www.figma.com/file/jixgHBXIThzdBwXKstjzt4/Senior-Design-Visualize-Commuter-Emissions?type=design&node-id=0-1&mode=design&t=NidnMDsOuoIs0yMW-0)
- [Reference NYC Taxi: Day in the Life](https://chriswhong.github.io/nyctaxi/#) and [Github Repo](https://github.com/chriswhong/nyctaxi)





---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
   parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
   },
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
