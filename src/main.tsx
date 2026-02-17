import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from "./App.tsx";
import "./index.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Hooks
import { UserContenidoProvider } from './hooks/UserConteProvider.js';

// IMPORTANTE: carga config ANTES de renderizar
import { loadConfig } from "./2-services/ApiConstants";

// Ejecuta primero loadConfig
loadConfig().then(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <UserContenidoProvider>
                    <App />
                </UserContenidoProvider>
            </BrowserRouter>
        </TooltipProvider>
    );
});
