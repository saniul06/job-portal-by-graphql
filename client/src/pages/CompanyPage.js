import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { companyByIdQuery, getCompanyById } from '../lib/graphql/queries'
import JobList from '../components/JobList';
import { useQuery } from '@apollo/client';
import { useCompany } from '../lib/graphql/hooks';

function CompanyPage() {
  const { companyId } = useParams();
  // const [state, setState] = useState({
  //   loading: true,
  //   company: undefined,
  //   error: false
  // })

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const data = await getCompanyById(companyId);
  //       setState({ loading: false, company: data })
  //     } catch (err) {
  //       console.log("error: ", JSON.stringify(err, null, 2))
  //       setState({ loading: false, error: true })
  //     }
  //   })()
  // }, [companyId])

  // const { loading, company, error } = state;

  const { loading, data, error } = useCompany(companyId);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data Not Found</div>
  }

  const { company } = data;

  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 className='title is-5'>Jobs at {company?.name}</h2>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyPage;
