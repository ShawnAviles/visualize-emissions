# Senior Design - Commuter Emissions

This project is a Stevens Institute of Technology Commuter Emissions Visulaizer created from as our Senior Design Project. We worked with the Office of Sustainability to collect commute information from faculty and students at Stevens Institute of Technology during the Fall 2023 to Spring 2024 semesters.

## Contributers
- Shawn 
- Harris
- Justin

# Demo

# Visualization
![VisualizeEmissions](https://github.com/user-attachments/assets/03e43b2b-e7e7-4333-b613-27a4fbe8496f)
![StudentRoutes](https://github.com/user-attachments/assets/00651b78-8da5-40fc-9822-ed5ec749326c)

### Metrics
| Bar Chart | Pie Chart |
|-----------|-----------|
|![BarChart](https://github.com/user-attachments/assets/6bbf8464-3c94-4489-92ea-6a87391346a3)|![PieChart](https://github.com/user-attachments/assets/d4fcd2cc-6b27-485a-b788-c860d4a9910d)|


# Setup

Repo made using React + TypeScript + Vite

1. Clone Repo Locally (or fork)
1. In `frontend`, create `.env` file with your MapBox API key to be stored
   - reference the [.env.example](./frontend/.env.example) to see how to set it up
   - create a new `.env` file with the variable named `VITE_MAPBOX_TOKEN` (all env variables here must be prefixed with _VITE_)
1. In `backend`, create `.env` file 
   - [.env.example](./backend/.env.example)
   - enter valid key for GOOGLE_MAPS_DIRECTIONS_TOKEN
1. run `docker compose up`
   - starts the frontend and backend docker images with the app viewable on `http://localhost:5173` and server running on `http://localhost:3000`


### Resources
- [React Mapbox Wrapper](https://visgl.github.io/react-map-gl/docs/get-started)
- [Figma Designs](https://www.figma.com/file/jixgHBXIThzdBwXKstjzt4/Senior-Design-Visualize-Commuter-Emissions?type=design&node-id=0-1&mode=design&t=NidnMDsOuoIs0yMW-0)
- [Reference NYC Taxi: Day in the Life](https://chriswhong.github.io/nyctaxi/#) and [Github Repo](https://github.com/chriswhong/nyctaxi)

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
