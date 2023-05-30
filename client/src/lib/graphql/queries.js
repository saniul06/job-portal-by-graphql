import { GraphQLClient, gql } from 'graphql-request'
import { getAccessToken } from '../auth';

const url = "http://localhost:9000/graphql";

const client = new GraphQLClient(url, {
    headers: () => {
        const token = getAccessToken();
        if (token) {
            return { "Authorization": `Bearer ${token}` }
        }
        return {}
    }
});

export async function createJob({ title, description }) {
    const query = gql`
    mutation($payload: CreateJobInput) {
        job: createJob(payload: $payload) {
            id
        }
    }
    `;
    const { job } = await client.request(query,
        { payload: { title, description } },
        // {
        //     "Authorization": `Bearer ${getAccessToken()}`
        // }
    );
    return job;
}

export async function getJobs() {
    const query = gql`
    query {
        jobs {
        id
        title
        date
        company {
            id
            name
        }
        }
    }
`;
    const { jobs } = await client.request(query);
    return jobs;
}

export async function getJobById(id) {
    const query = gql`
    query($id: ID!) {
    job(id: $id) {
        id
        title
        description
        date
        company {
            id
            name
        }
  }
    }
    `;
    const { job } = await client.request(query, { id });
    return job;
}

export async function getCompanyById(id) {
    const query = gql`
    query($id: ID!) {
    company(id: $id) {
        id
        name
        description
        jobs {
            id
            title
            date
        }
  }
    }
    `;
    const { company } = await client.request(query, { id });
    return company;
}