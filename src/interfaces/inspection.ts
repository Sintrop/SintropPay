export interface InspectionWeb3Props {
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

export interface InspectioApiProps {
    id: string;
    inspectionId: string;
    createdBy: string;
    createdAt: string;
    acceptedAt: string;
    status: number;
    inspectedAt?: string;
    propertyData: string;
    resultCategories?: string;
    userWallet?: string;
    currentLocation?: string;
    resultIdices?: string;
    proofPhoto?: string;
    biodversityIndice?: string;
    methodType?: string;
    zones?: string;
    resultInspection?: string;
    propertyPhotos?: string;
    soilBiodiversity?: string;
    audioSample?: string;
    springs?: string;
    urlVideo?: string;
    additionalData?: string;
}

export interface IndiceProps {
    id: string;
    title: string;
    category: string;
    carbonValue: number;
    bioValue: number;
    aguaValue: number;
    soloValue: number;
    createdAt: string;
    description?: string;
    placeholder?: string;
    type: string;
    unity?: string;
    order?: number;
    insumoCategory?: string;
    proofPhoto: boolean;
}

export interface ResultSubCategoryProps {
    categoryId: number;
    title: string;
    value: number;
    photo: string;
    coodinates: string;
    value2: string;
    categoryDetails: string;
}

export interface SpringProps {
    coord: {
        lat: number;
        lng: number;
    };
    photo: string;
    value: number;
}

export interface ResultIndicesProps {
    bio: number;
    carbon: number;
    soil: number;
    water: number;
}

interface PathZoneProps {
    lat: number;
    lng: number;
}
interface PointsToSortZoneProps {
    latitude: number;
    longitude: number;
}
interface AnaliseSoloProps {
    addPhoto1: string;
    addPhoto2: string;
    photo: string;
    value: number;
    coordRef: {
        lat: number;
        lng: number;
        type: string;
        id: number;
    },
    coord: {
        lat: number;
        lng: number;
    }
}
interface BioSoilProps {
    photo: string;
    value: number;
    coordRef: {
        lat: number;
        lng: number;
        type: string;
        id: number;
    },
    coord: {
        lat: number;
        lng: number;
    }
}
interface AnaliseBioProps {
    photo: string;
    id: number;
    coord: {
        lat: number;
        lng: number;
    },
    type: string;
    especieSelected: {
        id: string;
        name: string;
    }
}
interface PhotosZoneProps {
    photo: string;
}
interface TreeProps {
    photo: string;
    id: number;
    lat: number;
    lng: number;
    height: number;
    ray: number;
}
export interface ZoneProps {
    title: string;
    path: PathZoneProps[];
    areaZone: number;
    pointsToSort: PointsToSortZoneProps[];
    analiseSolo: AnaliseSoloProps[];
    soilUmid: boolean;
    bioSoil: BioSoilProps[];
    analiseBio: AnaliseBioProps[];
    photosZone: PhotosZoneProps[];
    arvores: {
        sampling1: {
            area: number;
            trees: TreeProps[]
        }
    }
}