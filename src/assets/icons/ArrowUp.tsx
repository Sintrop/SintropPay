import { IconBaseProps } from "../../components/Icon/Icon";

export function ArrowUp({color, size}: IconBaseProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 142 181" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M3.78391 80.2461C1.36107 77.8216 0 74.5337 0 71.1055C0 67.6772 1.36107 64.3893 3.78391 61.9648L61.9409 3.78537C64.3645 1.36159 67.6511 0 71.078 0C74.505 0 77.7916 1.36159 80.2151 3.78537L138.372 61.9648C140.726 64.4032 142.029 67.669 142 71.0589C141.97 74.4488 140.611 77.6915 138.215 80.0886C135.819 82.4857 132.577 83.8454 129.189 83.8749C125.8 83.9043 122.535 82.6012 120.098 80.2461L84.0018 45.2479L84.0018 168.071C84.0018 171.5 82.6402 174.789 80.2165 177.213C77.7928 179.638 74.5056 181 71.078 181C67.6504 181 64.3632 179.638 61.9395 177.213C59.5159 174.789 58.1542 171.5 58.1542 168.071L58.1542 45.2479L22.0581 80.2461C19.6346 82.6699 16.3479 84.0315 12.921 84.0315C9.4941 84.0315 6.20747 82.6699 3.78391 80.2461Z"
                fill={color}
            />
        </svg>
    )
}