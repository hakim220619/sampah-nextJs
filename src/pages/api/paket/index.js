import excuteQuery from 'src/configs/db'
import datetime from 'src/configs/date'
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
          query: 'select * from paket'
        })

        const { q = '' } = req.query ?? ''
        const queryLowered = q.toLowerCase()
        console.log(queryLowered)
        const filteredData = data.filter(
          data =>
            data.namePaket.toLowerCase().includes(queryLowered) ||
            data.price ||
            data.description.toLowerCase().includes(queryLowered)
        )

        // console.log(filteredData)
        res
          .status(200)
          .json({ allData: data, data: filteredData, params: req.params, total: filteredData.length, rows: 10 })
        // } else {
        //   res.status(200).json({ status: false, message: 'Token Invalide' })
        // }
        break

      case 'POST':
        const dateTime = await datetime()
        if (req.body.type == 'edit') {
          //   console.log(req.body.data)
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
          console.log(response)
          res.status(200).json({ status: 'Successs Update Data' })
        } else {
          const storedToken = req.body.headers.Authorization
          //   console.log(storedToken)
          const response = await excuteQuery({
            query: 'INSERT INTO paket (namePaket , price , description, state, created_at) VALUES (?, ?, ?, ?, ? ) ',
            values: [req.body.data.namePaket, req.body.data.price, req.body.data.description, 'ON', dateTime]
          })
          // console.log(response)
          res.status(200).json({ status: 'Successs Insert Data' })
        }

        break

      case 'DELETE':
        // console.log(req.body)
        const result = await excuteQuery({
          query: 'DELETE FROM wilayah WHERE id = ?',
          values: [req.body]
        })
        //some code...
        console.log(result)
        res.status(200).json({ status: 'Successs Deleted Data' })
        break

      default:
        res.status(405).end(`${method} Not Allowed`)
        break
    }
  } catch (error) {
    console.log(error)
  }
}
