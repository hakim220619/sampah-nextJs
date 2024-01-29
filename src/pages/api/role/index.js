import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    const storedToken = req.headers.authorization
    // console.log(storedToken)
    if (storedToken) {
      const result = await excuteQuery({
        query: 'select * from role where state = ?',
        values: ['ON']
      })
      // console.log(result)
      res.status(200).json({ data: result })
    } else {
      res.status(200).json({ status: false, message: 'Token Invalide' })
    }
  } catch (error) {
    console.log(error)
  }
}
