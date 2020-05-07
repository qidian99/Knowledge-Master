
import apolloClient from './index'
import {
  topicsQuery
} from './graphql'


export const fetchTopics = async function () {
  const operation = {
    query: topicsQuery
  }

  const res = await apolloClient.query(operation)
  const {
    data: {
      topics
    }
  } = res
  console.log('Fetched topics', topics)
  return topics
}
