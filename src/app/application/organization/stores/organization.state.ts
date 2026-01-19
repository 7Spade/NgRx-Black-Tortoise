import { Organization } from '@domain/account';

export interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  error: string | null;
}

export const initialOrganizationState: OrganizationState = {
  currentOrganization: null,
  organizations: [],
  loading: false,
  error: null,
};
