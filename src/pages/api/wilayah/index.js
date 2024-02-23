import excuteQuery from 'src/configs/db'
import datetime from 'src/configs/date'
import bcrypt from 'bcryptjs'

export default async (req, res) => {
  try {
    switch (req.method) {
      case 'GET':
        const storedToken = req.headers.authorization
        if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
          const data = await excuteQuery({
            query: 'select w.*, u.fullName from wilayah w, users u where w.userId=u.id'
          })
          const { q = '' } = req.query ?? ''
          const queryLowered = q.toLowerCase()
          const filteredData = data.filter(
            data =>
              data.name.toLowerCase().includes(queryLowered) || data.description.toLowerCase().includes(queryLowered)
          )
          res
            .status(200)
            .json({ allData: data, data: filteredData, params: req.params, total: filteredData.length, rows: 10 })
        } else {
          res.status(500).json({ status: 'Token Failed' })
        }
        break

      case 'POST':
        const dateTime = await datetime()
        if (req.body.data.type == 'edit') {
          const storedToken = req.body.headers.Authorization
          if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
            const response = await excuteQuery({
              query:
                ' UPDATE  wilayah SET userId = "' +
                req.body.data.userIdEd +
                '" , name = "' +
                req.body.data.nameEd +
                '" , description = "' +
                req.body.data.descriptionEd +
                '", state = "' +
                req.body.data.stateEd +
                '", updated_at = "' +
                dateTime +
                '" where id = "' +
                req.body.data.id +
                '" '
            })
            res.status(200).json({ status: 'Successs Update Data' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        } else {
          const storedToken = req.body.headers.Authorization
          if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
            const response = await excuteQuery({
              query: 'INSERT INTO wilayah (userId , name , description, state, created_at) VALUES (?, ?, ?, ?, ? ) ',
              values: [req.body.usersId, req.body.data.name, req.body.data.description, 'ON', dateTime]
            })
            res.status(200).json({ status: 'Successs Insert Data' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        }

        break

      case 'DELETE':
        const storedToken1 = req.headers.authorization
        if (storedToken1 == process.env.NEXT_PUBLIC_JWT_SECRET) {
          await excuteQuery({
            query: 'DELETE FROM wilayah WHERE id = ?',
            values: [req.body]
          })
          res.status(200).json({ status: 'Successs Deleted Data' })
        } else {
          res.status(500).json({ status: 'Token Failed' })
        }
        break

      default:
        res.status(405).end(`${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.log(error)
  }
}
