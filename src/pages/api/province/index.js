import excuteQuery from 'src/configs/db'

export default async (req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*') // replace this your actual origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT')
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    // const storedToken = req.headers.authorization
    // console.log(storedToken)
    // if (storedToken) {

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
