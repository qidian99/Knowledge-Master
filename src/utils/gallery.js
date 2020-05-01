import http from './request'
import {
  deleteFromGalleryMutation,
  addToGalleryMutation,
  deleteGalleryMutation
} from './queries'


export async function addToGallery (filepath) {
  const payload = {
    query: addToGalleryMutation,
    variables: {
      filepath
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      addToGallery
    }
  } = r

  console.log('Fetched gallery', addToGallery)
  return addToGallery
}


export async function deleteFromGallery (filepath) {
  const payload = {
    query: deleteFromGalleryMutation,
    variables: {
      filepath
    }
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      deleteFromGallery
    }
  } = r

  console.log('Deleted gallery', deleteFromGallery)
  return deleteFromGallery
}



export async function deleteGallery (filepath) {
  const payload = {
    query: deleteGalleryMutation
  }
  const r = await http.post({
    payload
  })

  const {
    data: {
      deleteGallery
    }
  } = r

  console.log('Deleted gallery', deleteGallery)
  return deleteGallery
}

