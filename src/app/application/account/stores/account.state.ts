import { Account } from '@domain/account';

export interface AccountState {
  currentAccount: Account | null;
  accounts: Account[];
  loading: boolean;
  error: string | null;
}

export const initialAccountState: AccountState = {
  currentAccount: null,
  accounts: [],
  loading: false,
  error: null,
};
