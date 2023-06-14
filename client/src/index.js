import React from 'react';
import ReactDOM from 'react-dom/client';

import { drizzleReactHooks } from '@drizzle/react-plugin'
import drizzle from "./drizzle";

import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <drizzleReactHooks.DrizzleProvider drizzle={drizzle}>
        <App/>
    </drizzleReactHooks.DrizzleProvider>
);