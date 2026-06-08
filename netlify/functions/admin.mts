import { handleAdminRequest } from './lib/handlers';

export default async (request: Request) => handleAdminRequest(request);

export const config = {
  path: '/api/admin/*',
};
