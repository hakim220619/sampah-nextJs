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
        // console.log(queryLowered)
        const filteredData = data.filter(
          data =>
            data.namePaket.toLowerCase().includes(queryLowered) || data.description.toLowerCase().includes(queryLowered)
        )

        // console.log(data)
        res
          .status(200)
          .json({ allData: data, data: filteredData, params: req.params, total: filteredData.length, rows: 10 })
        // } else {
        //   res.status(200).json({ status: false, message: 'Token Invalide' })
        // }
        break

      case 'POST':
        // console.log(req.body)
        const dateTime = await datetime()
        if (req.body.type == 'edit') {
          // console.log(req.body.headers.Authorization)
          if (req.body.headers.Authorization == process.env.NEXT_PUBLIC_JWT_SECRET) {
            const response = await excuteQuery({
              query:
                ' UPDATE  paket SET namePaket = "' +
                req.body.data.namePaketEd +
                '" , price = "' +
                req.body.data.priceEd +
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
            // console.log(response)
            res.status(200).json({ status: 'Successs Update Data' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        } else {
          const storedToken = req.body.headers.Authorization

          if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
            const response = await excuteQuery({
              query: 'INSERT INTO paket (namePaket , price , description, state, created_at) VALUES (?, ?, ?, ?, ? ) ',
              values: [req.body.data.namePaket, req.body.data.price, req.body.description, 'ON', dateTime]
            })
            // console.log(response)
            res.status(200).json({ status: 'Successs Insert Data' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        }

        break

      case 'DELETE':
        // console.log(req.body)
        const result = await excuteQuery({
          query: 'DELETE FROM paket WHERE id = ?',
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
