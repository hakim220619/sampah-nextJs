import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    const storedToken = req.headers.authorization
    // console.log(req.query.data)
    if (storedToken) {
      const result = await excuteQuery({
        query: 'select * from kabupaten where id_propinsi = ?',
        values: [req.query.data]
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
