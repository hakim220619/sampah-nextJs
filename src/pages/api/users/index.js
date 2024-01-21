import excuteQuery from 'src/configs/db'
import bcrypt from 'bcryptjs'
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
    switch (req.method) {
      case 'GET':
        /// const storedToken = req.headers.authorization
        // // console.log(res)
        // if (storedToken) {
        const result = await excuteQuery({
          query: 'select * from users'
        })
        // console.log(result)
        res.status(200).json({ data: result, rows: 10 })
        // } else {
        //   res.status(200).json({ status: false, message: 'Token Invalide' })
        // }
        break

      case 'POST':
        const hashedPassword = await bcrypt.hash(req.body.data.password, 60)

        console.log(hashedPassword)
        console.log(req.body.data.password)
        await excuteQuery({
          query:
            'INSERT INTO users (fullName , email , phone, address, role, password, created_at) VALUES (?, ?, ?, ?, ?, ?, ?) ',
          values: [
            req.body.data.fullName,
            req.body.data.email,
            req.body.data.phone,
            req.body.data.address,
            req.body.role,
            hashedPassword,
            date
          ]
        })
        // console.log(req.body.role)
        res.status(201).json({ status: 'Successs Insert Users' })
        break

      case 'PATCH':
        //some code...
        res.status(200).json({ response })
        break

      default:
        res.status(405).end(`${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.log(error)
  }
}
