import excuteQuery from 'src/configs/db'
import jwt from 'jsonwebtoken'

const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}
export default async (req, res) => {
  try {
    // console.log(req.body.token)
    const result = await excuteQuery({
      query: 'select u.* from personal_access_tokens pat, users u where pat.tokenable_id=u.id and pat.token = ?',
      values: [req.body.token]
    })
    res.status(200).json({ userData: result[0] })
  } catch (error) {
    console.log(error)
  }
}
