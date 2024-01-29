import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
// ** Config
import authConfig from 'src/configs/auth'

function RoleOptions() {
  const [values, setValues] = useState([])
  const [role, setrole] = useState()
  //   console.log(role)
  useEffect(() => {
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
    axios
      .get('http://localhost:3000/api/role', {
        headers: {
          Authorization: storedToken
        }
      })
      .then(response => response.data.data)
      .then(val => setValues(val))
  }, [])

  //   console.log(values, 'values')
  return (
    // <div>
    <Grid item sm={6} xs={12}>
      <FormControl fullWidth sx={{ mb: 6 }}>
        <InputLabel id='role-select'>Select Role</InputLabel>
        <Select
          fullWidth
          value={role}
          id='select-role'
          label='Select Role'
          labelId='role-select'
          onChange={e => setrole(e.target.value)}
          inputProps={{ placeholder: 'Select Role' }}
        >
          {/* <MenuItem value='admin'>Admin</MenuItem> */}
          {values.map((opts, i) => (
            <MenuItem key={i} value={opts.roleName}>
              {opts.roleName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
    // </div>
    // <div>
    //   <select onChange={e => setOptions(e.target.value)}>
    //     {values.map((opts, i) => (
    //       <option key={i}>{opts.roleName}</option>
    //     ))}
    //   </select>
    //   <h1>{options}</h1>
    // </div>
  )
}

export default RoleOptions
