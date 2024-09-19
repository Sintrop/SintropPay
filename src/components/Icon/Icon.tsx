import { ArrowDown } from "../../assets/icons/ArrowDown"
import { ArrowUp } from "../../assets/icons/ArrowUp";
import { Cart } from "../../assets/icons/Cart";
import { Close } from "../../assets/icons/Close";
import { Copy } from "../../assets/icons/Copy";
import { EyeOff } from "../../assets/icons/EyeOff";
import { House } from "../../assets/icons/House";
import { List } from "../../assets/icons/List";
import { Sheet } from "../../assets/icons/Sheet";

interface Props{
    name: IconName;
    color?: string;
    size?: number;
}

export interface IconBaseProps{
    size: number;
    color: string;
}

export function Icon({name, size = 20, color = 'white'}: Props){
    const SVGIcon = icons[name];

    return(
        <SVGIcon size={size} color={color}/>
    )
}

const icons = {
    arrowDown: ArrowDown,
    arrowUp: ArrowUp,
    cart: Cart,
    copy: Copy,
    eyeOff: EyeOff,
    house: House,
    list: List,
    sheet: Sheet,
    close: Close
}

type IconType = typeof icons;
type IconName = keyof IconType;