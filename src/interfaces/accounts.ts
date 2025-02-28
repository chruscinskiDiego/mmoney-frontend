export interface IAccounts {
    id: string;
    number: string;
    user: string;
    bank: string;
    fk_bank ?:string;
}