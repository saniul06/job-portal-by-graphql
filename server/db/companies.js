import DataLoader from 'dataloader'
import { connection } from './connection.js';

const getCompanyTable = () => connection.table('company');

export async function getCompany(id) {
  return await getCompanyTable().first().where({ id });
}

export const createCompanyLoader = () => new DataLoader(async ids => {
  const companies = await getCompanyTable().select().whereIn('id', ids);
  // return companies array in the same order the ids array
  return ids.map(id => companies.find(company => company.id === id));
})
