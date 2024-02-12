import excuteQuery from 'src/configs/db'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const jwtConfig = {
  secret: process.env.NEXT_PUBLIC_JWT_SECRET,
  expirationTime: process.env.NEXT_PUBLIC_JWT_EXPIRATION,
  refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}
export default async (req, res) => {
  try {
    var today = new Date(),
      date =
        today.getFullYear() +
        '-' +
        today.getMonth() +
        1 +
        '-' +
        today.getDate() +
        ' ' +
        today.getHours() +
        ':' +
        today.getMinutes() +
        ':' +
        today.getSeconds()
    // console.log(req.body)
    const { email, password } = req.body

    const result = await excuteQuery({
      query: 'select * from users where email = ?',
      values: [email]
    })
    // console.log(result)
    if (result.length > 0) {
      const passwordMatches = await bcrypt.compare(password, result[0]['password'])
      if (passwordMatches) {
        const accessToken = jwt.sign({ id: result[0]['id'] }, jwtConfig.secret, { expiresIn: jwtConfig.expirationTime })
        const cekToken = await excuteQuery({
          query: 'select * from personal_access_tokens where tokenable_id = ?',
          values: [result[0]['id']]
        })
        // console.log(accessToken)
        if (cekToken.length < 1) {
          await excuteQuery({
            query:
              'INSERT INTO personal_access_tokens (tokenable_type , tokenable_id , name, token, abilities, last_used_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ',
            values: ['Auth/Login', result[0]['id'], 'AuthToken', accessToken, '["*"]', date, date]
          })

          res.status(200).json({ userData: result[0], accessToken: accessToken })
        } else {
          const asd = await excuteQuery({
            query:
              'UPDATE personal_access_tokens SET token = "' +
              accessToken +
              '", updated_at = "' +
              date +
              '" WHERE tokenable_id = "' +
              result[0]['id'] +
              '"; '
          })
          // console.log(result[0])
          res.status(200).json({ userData: result[0], accessToken: accessToken })
        }
      } else {
        res.status(403).json({ status: 'Error', message: 'Invalid password' })
      }
    } else {
      res.status(404).json({ status: 'Error', message: 'Email not found' })
    }
  } catch (error) {
    console.log(error)
  }
}
