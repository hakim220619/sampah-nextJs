// ** React Imports
import { useState, useEffect, useCallback, forwardRef } from 'react'

// ** Next Imports
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Menu from '@mui/material/Menu'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import CardContent from '@mui/material/CardContent'
import { DataGrid } from '@mui/x-data-grid'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Store Imports
import { useDispatch, useSelector } from 'react-redux'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CardStatisticsHorizontal from 'src/@core/components/card-statistics/card-stats-horizontal'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Actions Imports
import { fetchData, deleteUser, editUser } from 'src/store/apps/user'

// ** Third Party Components
import axios from 'axios'

// ** Custom Table Components Imports
import TableHeader from 'src/views/apps/user/list/TableHeader'
import AddPaketsDialog from 'src/pages/apps/paket/AddPaketDialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import Fade from '@mui/material/Fade'
// ** Config
import authConfig from 'src/configs/auth'

import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { deletePaket, fetchDataPaket } from 'src/store/apps/paket'
import { NumericFormat } from 'react-number-format'
// ** Vars
const userRoleObj = {
  ADM: { icon: 'mdi:laptop', color: 'error.main' },
  ADW: { icon: 'mdi:cog-outline', color: 'warning.main' },
  PLG: { icon: 'mdi:pencil-outline', color: 'info.main' }
  // maintainer: { icon: 'mdi:chart-donut', color: 'success.main' },
  // subscriber: { icon: 'mdi:account-outline', color: 'primary.main' }
}
const showErrors = (field, valueLen, min) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const userStatusObj = {
  ON: 'primary',
  OFF: 'warning'
}
const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />
})

const formatCurrency = value => {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'IDR' }).replace('IDR', 'Rp. ').replace('.00', '')
}

const LinkStyled = styled(Link)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1rem',
  cursor: 'pointer',
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main
  }
}))

const RowOptions = ({ id, title }) => {
  // ** Hooks
  const dispatch = useDispatch()
  // console.log(fullName)
  // ** State

  const [anchorEl, setAnchorEl] = useState(null)
  const [EditUserOpen, setEditUserOpen] = useState(false)
  const rowOptionsOpen = Boolean(anchorEl)
  const [show, setShow] = useState(false)
  //   const [fullNameEd, setFullname] = useState(fullName)
  //   const [emailEd, setEmail] = useState(email)
  //   const [roleEd, setRole] = useState(role)
  //   const [stateEd, setState] = useState(state)
  //   const [phoneEd, setPhone] = useState(phone)
  //   const [addressEd, setAddress] = useState(address)

  const handleRowOptionsClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(deletePaket(id))
    handleRowOptionsClose()
  }
  // const schema = yup.object().shape({
  //   address: yup.string().required(),
  //   email: yup.string().email().required(),
  //   phone: yup
  //     .number()
  //     .typeError('Contact Number field is required')
  //     .min(10, obj => showErrors('Contact Number', obj.value.length, obj.min))
  //     .required(),
  //   fullName: yup
  //     .string()
  //     .min(3, obj => showErrors('First Name', obj.value.length, obj.min))
  //     .required(),
  //   password: yup
  //     .string()
  //     .min(3, obj => showErrors('Password', obj.value.length, obj.min))
  //     .required()
  // })
  const defaultValues = {
    titleEd: title
  }
  const [values, setValues] = useState([])
  // const [role, setrole] = useState()
  //   console.log(role)
  //   useEffect(() => {
  //     const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
  //     axios
  //       .get('http://localhost:3000/api/role', {
  //         headers: {
  //           Authorization: storedToken
  //         }
  //       })
  //       .then(response => response.data.data)
  //       .then(val => setValues(val))
  //   }, [])
  // console.log(defaultValues)
  const {
    reset,
    control,
    handleSubmit,

    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onChange'
    // resolver: yupResolver(schema)
  })

  const onSubmit = async () => {
    const dataAll = JSON.stringify({
      data: { id, title }
    })
    // console.log(dataAll)
    const customConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    // await axios
    //   .post('/api/users', dataAll, customConfig)
    //   .then(async response => {
    //     console.log(response)
    //     dispatch(editUser({ ...dataAll, role }))
    //     setShow(false), setAnchorEl(null), reset()
    //   })
    //   .catch(() => {
    //     console.log('gagal')
    //   })
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <Icon icon='mdi:dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem
          component={Link}
          sx={{ '& svg': { mr: 2 } }}
          onClick={handleRowOptionsClose}
          href='/apps/user/view/overview/'
        >
          <Icon icon='mdi:eye-outline' fontSize={20} />
          View
        </MenuItem>
        <MenuItem onClick={() => setShow(true)} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:pencil-outline' fontSize={20} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <Icon icon='mdi:delete-outline' fontSize={20} />
          Delete
        </MenuItem>
      </Menu>
      {/* <Card>
        <Dialog
          fullWidth
          open={show}
          maxWidth='md'
          scroll='body'
          onClose={() => {
            setShow(false), setAnchorEl(null), reset()
          }}
          TransitionComponent={Transition}
          onBackdropClick={() => {
            setShow(false), setAnchorEl(null), reset()
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent
              sx={{
                position: 'relative',
                pb: theme => `${theme.spacing(8)} !important`,
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <IconButton
                size='small'
                onClick={() => {
                  setShow(false), setAnchorEl(null), reset()
                }}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='mdi:close' />
              </IconButton>
              <Box sx={{ mb: 8, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
                  Edit Users
                </Typography>
              </Box>

              <Grid container spacing={6}>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={fullNameEd}
                      label='Full Name'
                      onChange={e => setFullname(e.target.value)}
                      placeholder='John Doe'
                      error={Boolean(errors.fullName)}
                    />

                    {errors.fullName && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.fullName.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      type='email'
                      value={emailEd}
                      label='Email'
                      onChange={e => setEmail(e.target.value)}
                      placeholder='johndoe@email.com'
                      error={Boolean(errors.email)}
                    />

                    {errors.email && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id='role-select'>Select Role</InputLabel>
                    <Select
                      fullWidth
                      value={roleEd}
                      id='select-role'
                      label='Select Role'
                      labelId='role-select'
                      onChange={e => setRole(e.target.value)}
                      inputProps={{ placeholder: 'Select Role' }}
                    >
                      {values.map((opts, i) => (
                        <MenuItem key={i} value={opts.code}>
                          {opts.roleName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <InputLabel id='role-select'>Select State</InputLabel>
                    <Select
                      fullWidth
                      value={stateEd}
                      id='select-state'
                      label='Select State'
                      labelId='state-select'
                      onChange={e => setState(e.target.value)}
                      inputProps={{ placeholder: 'Select State' }}
                    >
                      <MenuItem value='ON'>ON</MenuItem>
                      <MenuItem value='OFF'>OFF</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={12} xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      type='number'
                      value={phoneEd}
                      label='Phone'
                      onChange={e => setPhone(e.target.value)}
                      placeholder='(397) 294-5153'
                      error={Boolean(errors.phone)}
                    />

                    {errors.contact && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.contact.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth sx={{ mb: 6 }}>
                    <TextField
                      value={addressEd}
                      label='Address'
                      onChange={e => setAddress(e.target.value)}
                      placeholder='Jl hr **'
                      error={Boolean(errors.address)}
                    />

                    {errors.company && (
                      <FormHelperText sx={{ color: 'error.main' }}>{errors.company.message}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label='Make this default shipping address'
                    sx={{
                      '& .MuiFormControlLabel-label': {
                        color: 'text.secondary'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions
              sx={{
                justifyContent: 'center',
                px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
              }}
            >
              <Button variant='contained' sx={{ mr: 2 }} type='submit'>
                Submit
              </Button>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => {
                  setShow(false), setAnchorEl(null), reset()
                }}
              >
                Discard
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Card> */}
    </>
  )
}

const columns = [
  {
    flex: 0.2,
    minWidth: 250,
    field: 'namePaket',
    headerName: 'Name',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.namePaket}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'price',
    headerName: 'Price',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {formatCurrency(row.price)}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 250,
    field: 'description',
    headerName: 'Description',
    renderCell: ({ row }) => {
      return (
        <Typography noWrap variant='body2'>
          {row.description}
        </Typography>
      )
    }
  },
  //   {
  //     flex: 0.15,
  //     field: 'role',
  //     minWidth: 150,
  //     headerName: 'Role',
  //     renderCell: ({ row }) => {
  //       return (
  //         <Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[row.role].color } }}>
  //           <Icon icon={userRoleObj[row.role].icon} fontSize={20} />
  //           <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
  //             {row.role}
  //           </Typography>
  //         </Box>
  //       )
  //     }
  //   },

  //   {
  //     flex: 0.1,
  //     minWidth: 110,
  //     field: 'state',
  //     headerName: 'Status',
  //     renderCell: ({ row }) => {
  //       return (
  //         <CustomChip
  //           skin='light'
  //           size='small'
  //           label={row.state}
  //           color={userStatusObj[row.state]}
  //           sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
  //         />
  //       )
  //     }
  //   },
  //   {
  //     flex: 0.2,
  //     minWidth: 250,
  //     field: 'phone',
  //     headerName: 'Phone',
  //     renderCell: ({ row }) => {
  //       return (
  //         <Typography noWrap variant='body2'>
  //           {row.phone}
  //         </Typography>
  //       )
  //     }
  //   },
  //   {
  //     flex: 0.2,
  //     minWidth: 250,
  //     field: 'address',
  //     headerName: 'Address',
  //     renderCell: ({ row }) => {
  //       return (
  //         <Typography noWrap variant='body2'>
  //           {row.address}
  //         </Typography>
  //       )
  //     }
  //   },
  {
    flex: 0.1,
    minWidth: 90,
    sortable: false,
    field: 'actions',
    headerName: 'Actions',
    renderCell: ({ row }) => <RowOptions id={row.id} name={row.title} />
  }
]

const PostList = ({ apiData }) => {
  const [value, setValue] = useState('')
  const [addPaketOpen, setAddPaketOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  //   console.log(apiData)
  const dispatch = useDispatch()
  const store = useSelector(state => state.paket)
  // console.log(store)
  useEffect(() => {
    dispatch(
      fetchDataPaket({
        q: value
      })
    )
  }, [dispatch, value])
  const handleFilter = useCallback(val => {
    setValue(val)
  }, [])

  const toggleAddUserDialog = () => setAddPaketOpen(!addPaketOpen)

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <Divider />
          <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDialog} name='Paket' />
          <DataGrid
            autoHeight
            rows={store.data}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
          />
        </Card>
      </Grid>
      <AddPaketsDialog show={addPaketOpen} toggle={toggleAddUserDialog} />
    </Grid>
  )
}

export const getStaticProps = async () => {
  const res = await axios.get('http://localhost:3000/api/paket')
  const apiData = res.data
  return {
    props: {
      apiData
    }
  }
}

export default PostList
