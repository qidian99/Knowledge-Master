import http from './request'


export async function fetchPosts(query, topicId = null) {
    const self = this
    const payload = {
        query,
        variables: (topicId) ? { topicId } : null
    }
    const r = await http.post({
        payload
    })

    const {
        data: {
            posts
        }
    } = r

    console.log('Fetched posts', posts)
    return posts;
}