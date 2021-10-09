import { Base64 } from 'js-base64';

const getUsernameFromAccessToken = (accessToken) => {
  const decodedAccessToken = Base64.decode(accessToken)
  const info = decodedAccessToken.split(':')
  return info[0]
}

export {getUsernameFromAccessToken}