import { IconBaseProps } from "../../components/Icon/Icon";

export function House({ color, size }: IconBaseProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 181 164" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M107.391 63.3998C99.0703 55.7195 76.8781 53.165 76.8781 68.5256C76.8781 83.8862 107.391 76.2059 107.391 91.5582C107.391 106.91 82.4282 106.919 74.1072 96.6756M90.7493 103.807V114.607M90.7493 57.3005V48.0392M7.53906 48.0392L88.5192 7.54916C89.2118 7.20342 89.9752 7.02344 90.7493 7.02344C91.5233 7.02344 92.2868 7.20342 92.9793 7.54916L173.959 48.0392" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M157.328 73.0156V139.584C157.328 143.998 155.574 148.23 152.453 151.351C149.332 154.472 145.099 156.226 140.686 156.226H40.8334C36.4197 156.226 32.1867 154.472 29.0657 151.351C25.9448 148.23 24.1914 143.998 24.1914 139.584V73.0156" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}