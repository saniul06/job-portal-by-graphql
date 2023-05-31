import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getJobs, getJobsQuery } from '../lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { useJobs } from '../lib/graphql/hooks';

function HomePage() {
  // const [jobs, setJobs] = useState([]);

  const { loading, data, error } = useJobs();

  // useEffect(() => {
  //   getJobs().then(setJobs)
  // }, [])
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data Not Found</div>
  }

  const { jobs } = data;

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
