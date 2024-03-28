import { Session } from 'next-auth';

export type SessionInfo = {
    session: Session | null | undefined;
};

export type ModalFunction = {
    closeModal: () => void;
};

export type ForgotPasswordConfirmProps = {updateForgotPasswordModalState: (value: boolean) => void;};
export type ForgotPasswordConfirmModal = ForgotPasswordConfirmProps & ModalFunction;