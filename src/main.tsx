import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RouteProvider } from './providers/route-provider';
import { ThemeProvider } from './providers/theme-provider';
import App from './App';
import './styles/globals.css';
import './styles/theme.css';
import './index.css';
import ReactGA from "react-ga4";

ReactGA.initialize("G-XNC90DEJTW"); // ganti pake Measurement ID


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <RouteProvider>
                <ThemeProvider>
                    <App />
                </ThemeProvider>
            </RouteProvider>
        </BrowserRouter>
    </React.StrictMode>
);