import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css'
import { router } from './routes';
import { ToastContainer } from 'react-toastify';
import { MainContextProvider } from './contexts/MainContext';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MainContextProvider>
            <RouterProvider
                router={router}
            />
            <ToastContainer/>
        </MainContextProvider>
    </StrictMode>,
)
