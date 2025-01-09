import { createBrowserRouter } from "react-router-dom";
import { Home } from "../pages/Home/Home";
import { Send } from "../pages/Send/Send";
import { Sync } from "../pages/Sync/Sync";
import { Receive } from "../pages/Receive/Receive";
import { ConfirmPayment } from "../pages/ConfirmPayment/ConfirmPayment";
import { Transactions } from "../pages/Transactions/Transactions";
import { CheckoutRC } from "../pages/CheckoutRC/CheckoutRC";
import { ResetPasswordRC } from "@/pages/ResetPasswordRC/ResetPasswordRC";

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
    {
        path: '/confirm-payment/:paymentCode',
        Component: ConfirmPayment
    },
    {
        path: '/transactions',
        Component: Transactions
    },
    {
        path: '/checkout-rc',
        Component: CheckoutRC
    },
    {
        path: '/reset-password-rc',
        Component: ResetPasswordRC
    },
])