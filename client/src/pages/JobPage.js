import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import { getJobById, jobByIdQuery } from '../lib/graphql/queries'
import { useQuery } from '@apollo/client';
import { useJob } from '../lib/graphql/hooks';

function JobPage() {
  const { jobId } = useParams();
  // const [state, setState] = useState({
  //   loading: true,
  //   job: undefined,
  //   error: false
  // })


  // useEffect(() => {
  //   getJobById(jobId)
  //     .then(data => setState(prev => ({ ...prev, job: data, loading: false })))
  //     .catch(err => {
  //       console.log('err: ', JSON.stringify(err, null, 2));
  //       setState(prev => ({ ...prev, error: true, loading: false }))
  //     })
  // }, [jobId])

  // const { loading, job, error } = state;

  const { loading, data, error } = useJob(jobId);

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data Not Found</div>
  }

  const { job } = data;

  return (
    <div>
      <h1 className="title is-2">
        {job?.title}
      </h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job?.company?.id}`}>
          {job?.company?.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {formatDate(job?.date, 'long')}
        </div>
        <p className="block">
          {job?.description}
        </p>
      </div>
    </div>
  );
}

export default JobPage;
