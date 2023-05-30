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
    cache: new InMemoryCache()
})

export async function createJob({ title, description }) {
    const mutation = gql`
    mutation($payload: CreateJobInput) {
        job: createJob(payload: $payload) {
            id
        }
    }
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
    const { data } = await apolloClient.query({ query })
    return data.jobs;
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
    // const { job } = await client.request(query, { id });
    const { data } = await apolloClient.query({ query, variables: { id } });
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