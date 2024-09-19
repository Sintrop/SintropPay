import { IconBaseProps } from "../../components/Icon/Icon";

export function Copy({ color, size }: IconBaseProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 229 264" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M179.961 228.499H162.404V246.099H17.5572V65.7013H35.1143V48.1016H0V263.698H179.961V228.499Z" fill={color} />
            <path d="M53.4531 0V210.251H228.069V75.2158L153.108 0H53.4531ZM210.607 192.73H70.9147V17.521H127.665V100.745H210.607V192.73ZM210.607 83.2245H145.126V17.521H145.875L210.607 82.4728V83.2245Z" fill={color} />
        </svg>
    )
}