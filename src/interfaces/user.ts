export interface UserApiProps {
    id: string;
    wallet: string;
    name: string;
    imgProfileUrl: string;
    userType: number;
    address: string;
    propertyGeolocation: string
    zones: string;
}

export interface ProducerProps {
    id: number;
    producerWallet: string;
    name: string;
    proofPhoto: string;
    pendingInspection: boolean
    totalInspections: number;
    lastRequestAt: number;
    isa: {
        isaScore: number;
        isaAverage: number;
        sustainable: boolean
    },
    areaInformation: {
        coordinates: string;
        totalArea: number;
    },
    pool: {
        currentEra: number;
        onContractPool: string;
    }
}