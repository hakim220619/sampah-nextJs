import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    // console.log(storedToken)
    // if (storedToken) {
    console.log(res)
    const result = await excuteQuery({
      query: 'select * from propinsi'
    })
    // console.log(result)
    res.status(200).json({ data: result })
    // } else {
    //   res.status(200).json({ status: false, message: 'Token Invalide' })
    // }
  } catch (error) {
    console.log(error)
  }
}
