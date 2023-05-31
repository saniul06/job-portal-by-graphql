import { useState } from 'react';
import { createJob, createJobMutation, jobByIdQuery } from '../lib/graphql/queries';
import { useNavigate } from 'react-router';
import { useMutation } from '@apollo/client';
import { useCreateJob } from '../lib/graphql/hooks';

function CreateJobPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createJob, result } = useCreateJob();

  console.log('result by useMutation: ', result);
  const { loading, error } = result;

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // const { id } = await createJob({ title, description })
      const result = await createJob({ title, description })
      console.log('result by submission: ', result);
      const { data: { job } } = result;
      navigate(`/jobs/${job?.id}`);
    } catch (err) {
      console.log('err is: ', err);
    }
  };

  if (error) {
    return <div className="has-text-danger">{error?.message}</div>
  }

  return (
    <div>
      <h1 className="title">
        New Job
      </h1>
      <div className="box">
        <form>
          <div className="field">
            <label className="label">
              Title
            </label>
            <div className="control">
              <input className="input" type="text" value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label className="label">
              Description
            </label>
            <div className="control">
              <textarea className="textarea" rows={10} value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSubmit} disabled={loading}>
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJobPage;
