import { getJobs, getJob, getJobsByCompanyId, createJob, deleteJob, updateJob } from './db/jobs.js'
import { getCompany } from './db/companies.js'
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        jobs: () => getJobs(),
        job: async (_, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError(`Job not found with id ${id}`)
            }
            return job;
        },
        company: async (_, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError(`Company not found with id ${id}`)
            }
            return company;
        }

    },
    Mutation: {
        createJob: async (_, { payload: { title, description } }, { user }) => {
            if (!user) {
                throw unauthorizeError("User is not authenticated")
            }
            const job = await createJob({ companyId: user.companyId, title, description })
            return job;
        },
        deleteJob: async (_, { id }, { user }) => {
            if (!user) {
                throw unauthorizeError("User is not authenticated")
            }
            const job = await deleteJob(id, user?.companyId);
            if (!job) {
                throw notFoundError(`No job found for id ${id}`)
            }
            return job;
        },
        updateJob: async (_, { payload: { id, title, description } }, { user }) => {
            if (!user) {
                throw unauthorizeError("User is not authenticated")
            }
            const job = await updateJob({ id, title, description, companyId: user?.companyId })
            if (!job) {
                throw notFoundError(`No job found for id ${id}`)
            }
            return job;
        },
    },
    Job: {
        date: (job) => toISODate(job.createdAt),
        // company: (job) => getCompany(job.companyId)
        company: (job, _args, { companyLoader }) => companyLoader.load(job.companyId)
    },
    Company: {
        jobs: (company) => getJobsByCompanyId(company.id)
    }
}

function toISODate(value) {
    return value.slice(0, "yyyy-mm-dd".length);
}

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: { code: "NOT_FOUND" }
    })
}

function unauthorizeError(message) {
    return new GraphQLError(message, {
        extensions: { code: "UNAUTHORIZE" }
    })
}