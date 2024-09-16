import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { Send } from "../pages/Send/Send";
import { Sync } from "../pages/Sync/Sync";
import { Receive } from "../pages/Receive/Receive";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Sync,
    },
    {
        path: '/dashboard',
        Component: Home,
    },
    {
        path: '/send',
        Component: Send
    },
    {
        path: '/receive',
        Component: Receive
    },
])