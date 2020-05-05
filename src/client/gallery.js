import apolloClient from './index'
import {
  deleteFromGalleryMutation,
  addToGalleryMutation,
  deleteGalleryMutation
} from './graphql'


export async function addToGallery (filepath) {
  const operation = {
    query: addToGalleryMutation,
    variables: {
      filepath
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      addToGallery
    }
  } = res

  console.log('Fetched gallery', addToGallery)
  return addToGallery
}


export async function deleteFromGallery (filepath) {
  const operation = {
    query: deleteFromGalleryMutation,
    variables: {
      filepath
    }
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      deleteFromGallery
    }
  } = res

  console.log('Deleted gallery', deleteFromGallery)
  return deleteFromGallery
}



export async function deleteGallery (filepath) {
  const operation = {
    query: deleteGalleryMutation
  }
  const res = await apolloClient.query(operation)

  const {
    data: {
      deleteGallery
    }
  } = res

  console.log('Deleted gallery', deleteGallery)
  return deleteGallery
}

