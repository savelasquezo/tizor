import { Session } from 'next-auth';

export type SessionAuth = {session: Session | null | undefined;};
export type SessionAuthenticated = {session: Session;};
export type ModalFunction = {closeModal: () => void;};
export type SessionAuthModal = SessionInfo & ModalFunction;
export type ForgotPasswordConfirm = {updateForgotPasswordModalState: (value: boolean) => void;};
export type ForgotPasswordConfirmInfo = ForgotPasswordConfirm & ModalFunction;

export type TransactionsInfo = {
    id: number;
    amount: number;
    date: string;
    type: string;
    voucher: string;
    account: string;
    state: string;
};

export type TicketInfo = {
    address: string;
    amount: number;
    date: string;
    voucher: string;
    state: string;
};

export type InvestmentInfo = {
    uuid: string;
    amount: number;
    interest: number;
    accumulated: number | null;
    date_joined: string;
    date_target: string;
    voucher: string;
    state: string;
};

export type HistoryInfo = {
    date: string;
    balance: number;
    history: number;
};

export type AccountReferedInfo = {
    username: string;
    balance: number;
    date_joined: string;
};

export type LinkType = {
    id: number;
    uuid: string;
    is_active: boolean;
    name: string;
    link: string;
    settings: number;
};

export type ImageType = {
    id: number;
    file: string | null;
};

export type FAQType = {
    id: number;
    question: string;
    answer: string;
};

export type SiteType = {
    id: number;
    default: string;
    ref: number;
    min_interest: number;
    max_interest: number;
    email: string;
    address: string;
    file: string | null;
    legal: string;
    template_block: string | null;
    template_block_status: string | null;
    template_invoice: string | null;
    template_invoice_status: string | null;
    template_withdrawal: string | null;
    template_withdrawal_status: string | null;
    terms: string;
    links: LinkType[];
    images: ImageType[];
    faqs: FAQType[];
};

