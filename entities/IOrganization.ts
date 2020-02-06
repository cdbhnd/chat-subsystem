export interface IOrganization {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  apiKey: string;
  hooks: Array<{
    event: string,
    url: string,
  }>;
}
