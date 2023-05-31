export const typeDefs = `#graphql
type Query {
    """Return array of jobs"""
    # jobs(limit: Int, offset: Int): [Job!]
    jobs(limit: Int, offset: Int): JobSubList
    job(id: ID): Job
    company(id: ID): Company
}

type Mutation {
    createJob(payload: CreateJobInput): Job
    deleteJob(id: String): Job
    updateJob(payload: UpdateJobInput): Job
}

input CreateJobInput {
    title: String!
    description: String
}

input UpdateJobInput {
    id: String!
    title: String!
    description: String
}

type Company {
    id: ID!
    name: String!
    description: String
    jobs: [Job!]!
}

type Job {
    id: ID!
    title: String!
    description: String
    """__Date should be iso date string in 8601 format  """
    date: String!
    company: Company!
    }

type JobSubList {
    items: [Job!]!
    totalCount: Int
}


`