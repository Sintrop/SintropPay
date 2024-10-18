export interface InspectionWeb3Props{
    id: number;
    producer: string;
    inspector: string;
    status: string;
    createdAt: number;
    acceptedAt: number;
    inspectedAt: number;
    isaScore: number;
    inspectedAtEra: number;
    invalidatedAt: number;
    proofPhoto: string;
    validationsCount: number;
    report: string;
}

interface PathZoneProps{
    lat: number;
    lng: number;
}
interface PointsToSortZoneProps{
    latitude: number;
    longitude: number;
}
export interface ZoneProps{
    title: string;
    path: PathZoneProps[];
    areaZone: number;
    pointsToSort: PointsToSortZoneProps[]
}