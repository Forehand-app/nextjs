export interface OptionsData {
    id: number;
    code: string;
    label: string;
}

export interface ProfileData {
    name: string;
    dob: string; // ISO 8601 string
    gender: string;
    phone: string;
    profilePicUrl?: string | null;
    profilePicPath?: string | null;
    playingHand?: string | null;
    primarySport?: string | null;
}

export interface OrganizationData {
    id?: string | null;
    name: string;
    description: string;

    orgType?: OptionsData | null;
    orgTypeCode?: string | null;

    logoUrl?: string | null;
    logoPath?: string | null;

    establishedYear: number;
    website?: string | null;

    contactEmail: string;
    contactPhone: string;

    postalCode: string;
    state: string;
    city: string;
    address: string;

    verified: boolean;
}

export type TournamentState = 'created' | 'draft' | 'live' | 'past'; // Add more states as needed

export interface TournamentData {
    id?: string | null;
    organizationId: string;
    organization?: OrganizationData | null;

    name: string;
    description: string;

    startDate: string; // ISO 8601 string
    endDate?: string | null;

    venueName: string;
    venueAddress: string;
    venueCity: string;
    venueState: string;
    venuePostalCode: string;
    venueCourts: number;

    logoUrl?: string | null;
    logoPath?: string | null;

    contactName: string;
    contactEmail: string;
    contactPhone: string;

    upiId?: string | null;

    tournamentState?: TournamentState | null;
    events?: EventData[] | null;
}

export type EventState = 'created'; // Add more states as needed

export interface EventData {
    id?: string | null;
    tournamentId: string;
    name: string;

    startDate: string; // ISO 8601 string
    dueDate: string; // ISO 8601 string

    sportsOptionCode?: string | null;
    sportsOption?: OptionsData | null;

    eventFormatCode?: string | null;
    eventFormat?: OptionsData | null;

    gender?: string | null;
    playerBornAfter?: string | null; // ISO 8601 string

    teamTypeCode?: string | null;
    teamType?: OptionsData | null;

    pointsPerSet: number;
    setsPerMatch: number;

    paymentModeCode?: string | null;
    paymentMode?: OptionsData | null;
    amount: number;

    winnerId?: string | null;
    eventState?: EventState | null;
    activeRound?: number | null;

    teams?: TeamData[] | null;
}

export type TeamStatus = 'registered'; // Add more statuses as needed

export interface TeamData {
    id?: string | null;
    status?: TeamStatus | null;
    teamTypeCode?: string | null;
    teamType?: OptionsData | null;
    event?: EventData | null;
}
