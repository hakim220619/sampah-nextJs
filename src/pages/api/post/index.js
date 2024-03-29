import excuteQuery from 'src/configs/db'
import bcrypt from 'bcryptjs'

export default async (req, res) => {
  try {
    console.log(req.method)
    switch (req.method) {
      case 'GET':
        // const storedToken = req.headers.authorization
        // console.log(storedToken)
        // if (storedToken) {
        const data = await excuteQuery({
          query: 'select * from posts'
        })

        const { q = '' } = req.query ?? ''
        const queryLowered = q.toLowerCase()
        console.log(data)
        const filteredData = data.filter(
          data =>
            data.title.toLowerCase().includes(queryLowered) ||
            data.content.toLowerCase().includes(queryLowered) ||
            data.state.toLowerCase().includes(queryLowered)
        )

        console.log(filteredData)
        res
          .status(200)
          .json({ allData: data, posts: filteredData, params: req.params, total: filteredData.length, rows: 10 })
        // } else {
        //   res.status(200).json({ status: false, message: 'Token Invalide' })
        // }
        break

      case 'POST':
        // console.log()
        if (req.body.data.type == 'edit') {
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
          // const hashedPassword = await bcrypt.hash(req.body.data.passwordEd, 10)
          const response = await excuteQuery({
            query:
              ' UPDATE  users SET fullName = "' +
              req.body.data.fullNameEd +
              '" , email = "' +
              req.body.data.emailEd +
              '" , phone = "' +
              req.body.data.phoneEd +
              '", address = "' +
              req.body.data.addressEd +
              '", role = "' +
              req.body.data.roleEd +
              '", state = "' +
              req.body.data.stateEd +
              '" where id = "' +
              req.body.data.id +
              '" '
          })
          // console.log(response)
          res.status(201).json({ status: 'Successs Update Users' })
        } else {
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
          // console.log(req.body.role)
          const hashedPassword = await bcrypt.hash(req.body.data.password, 10)
          const response = await excuteQuery({
            query:
              'INSERT INTO users (fullName , email , phone, address, role, password, state, created_at, provinceId, regencyId, districtId, villageId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',
            values: [
              req.body.data.fullName,
              req.body.data.email,
              req.body.data.phone,
              req.body.data.address,
              req.body.role,
              hashedPassword,
              'ON',
              date,
              req.body.province,
              req.body.regency,
              req.body.district,
              req.body.village
            ]
          })
          console.log(response)
          res.status(201).json({ status: 'Successs Insert Users' })
        }
        break

      case 'DELETE':
        // console.log(req.body)
        // const result = await excuteQuery({
        //   query: 'DELETE FROM users WHERE id = ?',
        //   values: [req.body]
        // })
        // //some code...
        // console.log(result)
        // res.status(200).json({ status: 'Successs Deleted Users' })
        break

      default:
        res.status(405).end(`${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.log(error)
  }
}
