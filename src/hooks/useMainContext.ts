import { useContext } from "react";
import { MainContext, MainContextProps } from "../contexts/MainContext";

export function useMainContext(): MainContextProps{
    const context = useContext(MainContext);
    return context;
}