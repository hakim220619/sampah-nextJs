import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    const storedToken = req.headers.authorization
    console.log(storedToken)
    if (storedToken) {
      const result = await excuteQuery({
        query: 'select u.* from personal_access_tokens pat, users u where pat.tokenable_id=u.id and pat.token = ?',
        values: [storedToken]
      })
      // console.log(result)
      res.status(200).json({ userData: result[0] })
    } else {
      res.status(200).json({ status: false, message: 'Token Invalide' })
    }
  } catch (error) {
    console.log(error)
  }
}
