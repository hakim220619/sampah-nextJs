import excuteQuery from 'src/configs/db'
import bcrypt from 'bcryptjs'

export default async (req, res) => {
  try {
    // console.log(req)
    switch (req.method) {
      case 'GET':
        // const storedToken = req.headers.authorization
        // console.log(storedToken)
        // if (storedToken) {
        const data = await excuteQuery({
          query: 'select w.*, u.fullName from wilayah w, users u where w.userId=u.id'
        })

        const { q = '' } = req.query ?? ''
        const queryLowered = q.toLowerCase()
        // console.log(data)
        const filteredData = data.filter(
          data =>
            data.name.toLowerCase().includes(queryLowered) || data.description.toLowerCase().includes(queryLowered)
        )

        // console.log(filteredData)
        res
          .status(200)
          .json({ allData: data, wilayah: filteredData, params: req.params, total: filteredData.length, rows: 10 })
        // } else {
        //   res.status(200).json({ status: false, message: 'Token Invalide' })
        // }
        break

      case 'POST':
        const storedToken = req.headers.authorization
        console.log(storedToken)

        break

      case 'DELETE':
        console.log(req.body)
        break

      default:
        res.status(405).end(`${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.log(error)
  }
}
