import { Session } from 'next-auth';

export type SessionAuth = {
    session: Session | null | undefined;
};

export type SessionAuthenticated = {
    session: Session;
};

export type TransactionsInfo = {
    id: number;
    amount: number;
    fee: number;
    date: string;
    type: string;
    voucher: string;
    account: string;
};

export type HistoryInfo = {
    date: string;
    balance: number;
    history: number;
};
  
export type ModalFunction = {
    closeModal: () => void;
};

export type ForgotPasswordConfirm = {updateForgotPasswordModalState: (value: boolean) => void;};
export type ForgotPasswordConfirmInfo = ForgotPasswordConfirm & ModalFunction;
