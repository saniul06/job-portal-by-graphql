import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client'
import { GraphQLClient, gql as gr_gql } from 'graphql-request'
import { getAccessToken } from '../auth';

const url = "http://localhost:9000/graphql";

// const client = new GraphQLClient(url, {
//     headers: () => {
//         const token = getAccessToken();
//         if (token) {
//             return { "Authorization": `Bearer ${token}` }
//         }
//         return {}
//     }
// });

const httpLink = createHttpLink({ uri: url });

const authLink = new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
        operation.setContext({
            headers: { "Authorization": `Bearer ${token}` }
        })
    }
    return forward(operation);
})

const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network-only'
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only'
    //     }
    // }
})

const jobDetailsFragment = gql`
fragment JobDetails on Job {
    id
    title
    description
    date
    company {
      id
      name
      description
    }
}
`;

const jobByIdQuery = gql`
query($id: ID!) {
    job(id: $id) {
        ...JobDetails
    }
}

${jobDetailsFragment}
`;

export async function createJob({ title, description }) {
    const mutation = gql`
    mutation($payload: CreateJobInput) {
        job: createJob(payload: $payload) {
            ...JobDetails
        }
    }

    ${jobDetailsFragment}
    `;
    // const { job } = await client.request(mutation,
    //     { payload: { title, description } },
    //     // {
    //     //     "Authorization": `Bearer ${getAccessToken()}`
    //     // }
    // );
    const { data } = await apolloClient.mutate({
        mutation,
        variables: { payload: { title, description } },
        update: (cache, result) => {
            cache.writeQuery({
                query: jobByIdQuery,
                variables: { id: result.data.job.id },
                data: result.data
            })
        }
        // context: {
        //     headers:
        //         {
        //             "Authorization": `Bearer ${getAccessToken()}`
        //         }
        // }
    })
    return data.job;
}

export async function getJobs() {
    const query = gql`
    query Jobs{
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
    // const { jobs } = await client.request(query);
    const { data } = await apolloClient.query({
        query,
        fetchPolicy: 'network-only'
    })
    return data.jobs;
}

export async function getJobById(id) {
    // const { job } = await client.request(query, { id });
    const { data } = await apolloClient.query({ query: jobByIdQuery, variables: { id } });
    return data.job;
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
    // const { company } = await client.request(query, { id });
    const { data } = await apolloClient.query({ query, variables: { id } });
    return data.company;
}