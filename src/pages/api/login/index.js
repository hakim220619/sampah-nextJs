import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    console.log(req.body.data.email)
    const result = await excuteQuery({
      query: 'select * from users where email = ?',
      values: [req.body.data.email]
    })
    res.status(200).json({ data: result[0] })
  } catch (error) {
    console.log(error)
  }
}
