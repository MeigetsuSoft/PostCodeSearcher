export type PostCodeRecord<IDType, PostCodeDataType> = {
    id: IDType;
    postcode: PostCodeDataType;
    prefecture: string;
    prefecture_kana?: string;
    city: string;
    city_kana?: string;
    address?: string;
    address_kana?: string;
};
