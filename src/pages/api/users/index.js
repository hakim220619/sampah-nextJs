import excuteQuery from 'src/configs/db'
import bcrypt from 'bcryptjs'
import datetime from 'src/configs/date'

export default async (req, res) => {
  try {
    // console.log(req.query.Authorization)
    switch (req.method) {
      case 'GET':
        switch (req.query.params) {
          case 'getUsersAll':
            break
          case 'getUsersAdminWilayah':
            const storedToken = req.query.Authorization
            // console.log(req.query.params)
            if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
              const data = await excuteQuery({
                query:
                  'select u.*, p.nama as propinsi, k.nama as kabupaten, kc.nama as kecamatan, d.nama as desa from users u, propinsi p, kabupaten k, kecamatan kc, desa d WHERE u.provinceId=p.id AND u.regencyId=k.id AND u.districtId=kc.id and u.villageId=d.id and u.role = ?',
                values: ['ADW']
              })
              res.status(200).json({ allData: data, status: true })
            } else {
              res.status(500).json({ status: 'Token Failed' })
            }
            break
          default:
            // const storedToken = req.headers.authorization
            // console.log(req.query)
            // if (storedToken) {
            const dataAll = await excuteQuery({
              query: 'select * from users'
            })

            const { q = '' } = req.query ?? ''
            const queryLowered = q.toLowerCase()
            // console.log(queryLowered)
            const filteredData = dataAll.filter(
              data =>
                data.email.toLowerCase().includes(queryLowered) ||
                data.fullName.toLowerCase().includes(queryLowered) ||
                data.role.toLowerCase().includes(queryLowered)
            )

            // console.log(filteredData)
            res
              .status(200)
              .json({ allData: dataAll, data: filteredData, params: req.params, total: filteredData.length, rows: 10 })
            // } else {
            //   res.status(200).json({ status: false, message: 'Token Invalide' })
            // }
            break
        }

        break

      case 'POST':
        // console.log(req.body.type)

        if (req.body.type == 'edit') {
          const storedToken = req.body.headers.Authorization
          // console.log(storedToken)
          if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
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
            console.log(response)
            res.status(201).json({ status: 'Successs Update Users' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        } else {
          const storedToken = req.body.headers.Authorization
          if (storedToken == process.env.NEXT_PUBLIC_JWT_SECRET) {
            const dateTime = await datetime()
            console.log(req.body.data.data)
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
                dateTime,
                req.body.province,
                req.body.regency,
                req.body.district,
                req.body.village
              ]
            })
            // console.log(response)
            res.status(201).json({ status: 'Successs Insert Users' })
          } else {
            res.status(500).json({ status: 'Token Failed' })
          }
        }
        break

      case 'DELETE':
        const storedToken1 = req.headers.authorization
        if (storedToken1 == process.env.NEXT_PUBLIC_JWT_SECRET) {
          const result = await excuteQuery({
            query: 'DELETE FROM users WHERE id = ?',
            values: [req.body]
          })
          //some code...
          console.log(result)
          res.status(200).json({ status: 'Successs Deleted Users' })
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
