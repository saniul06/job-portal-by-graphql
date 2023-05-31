import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getJobs, getJobsQuery } from '../lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { useJobs } from '../lib/graphql/hooks';
import PaginationBar from '../components/PaginationBar'

const JOBS_PER_PAGE = 5;

function HomePage() {
  // const [jobs, setJobs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const { loading, data, error } = useJobs(JOBS_PER_PAGE, (currentPage - 1) * JOBS_PER_PAGE);

  // useEffect(() => {
  //   getJobs().then(setJobs)
  // }, [])
  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className="has-text-danger">Data Not Found</div>
  }

  const { jobs: { items, totalCount } } = data;
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      {/* <div>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        <span> {currentPage} of {totalPages} </span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div> */}
      <PaginationBar currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      <JobList jobs={items} />
    </div>
  );
}

export default HomePage;
