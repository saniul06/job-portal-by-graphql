import { useMutation, useQuery } from "@apollo/client";
import { companyByIdQuery, createJobMutation, getJobsQuery, jobByIdQuery } from "./queries";

export function useCompany(id) {
    const { loading, data, error } = useQuery(companyByIdQuery, {
        variables: { id }
    })
    return { loading, data, error };
}

export function useJobs() {
    const { loading, data, error } = useQuery(getJobsQuery, { fetchPolicy: 'network-only' })
    return { loading, data, error }
}

export function useJob(id) {
    const { loading, data, error } = useQuery(jobByIdQuery, { variables: { id } });
    return { loading, data, error };
}

export function useCreateJob() {
    const [mutate, result] = useMutation(createJobMutation);
    return {
        createJob: async function ({ title, description }) {
            const result = await mutate({
                variables: { payload: { title, description } },
                update: (cache, result) => {
                    cache.writeQuery({
                        query: jobByIdQuery,
                        variables: { id: result.data.job.id },
                        data: result.data
                    })
                }
            })
            return result;
        },
        result
    }
}