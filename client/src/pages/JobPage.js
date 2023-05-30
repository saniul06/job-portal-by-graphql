import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/formatters';
import { getJobById } from '../lib/graphql/queries'

function JobPage() {
  const { jobId } = useParams();
  const [state, setState] = useState({
    loading: true,
    job: undefined,
    error: false
  })


  useEffect(() => {
    getJobById(jobId)
      .then(data => setState(prev => ({ ...prev, job: data, loading: false })))
      .catch(err => {
        console.log('err: ', JSON.stringify(err, null, 2));
        setState(prev => ({ ...prev, error: true, loading: false }))
      })
  }, [jobId])

  const { loading, job, error } = state;

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data Not Found</div>
  }

  if (!job) {
    return <div>Loading</div>
  }
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
