import http from './request'
import { updateUserProfileMutation } from "./queries";


export async function updateUserProfile(user) {
    const payload = {
        query: updateUserProfileMutation,
        variables: user
    }
    const r = await http.post({
        payload
    })

    const {
        data: {
            updateUserProfile
        }
    } = r

    console.log('Updated profile', updateUserProfile)
    return updateUserProfile;
}
