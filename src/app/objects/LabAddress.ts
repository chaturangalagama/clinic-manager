export interface Laboratory {
    name: string;
    address: Address;
}

export interface Address {
    attentionTo: string;
    street: string;
    unit: string;
    postalCode: string;
}
