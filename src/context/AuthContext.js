// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'
import url from 'src/configs/url'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve()
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = window.localStorage.getItem('token')
      const userData = window.localStorage.getItem('userData')
      const refreshToken = window.localStorage.getItem('refreshToken')
      console.log(userData)
      console.log(storedToken)
      // console.log(refreshToken)
      // localStorage.removeItem('userData')
      // localStorage.removeItem('refreshToken')
      // localStorage.removeItem('accessToken')
      if (storedToken) {
        setLoading(true)
        const public_url = await url()
        await axios
          .post(public_url + '/checkLogin', { token: storedToken })
          .then(async response => {
            // console.log(response)
            setLoading(false)
            setUser({ ...response.data.userData })
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('accessToken')
            setUser(null)
            setLoading(false)
            if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
              router.replace('/login')
            }
          })
      } else {
        setLoading(false)
        localStorage.removeItem('userData')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('accessToken')
        // router.push('/login')
      }
    }
    initAuth()
  }, [])

  const handleLogin = async (params, errorCallback) => {
    const public_url = await url()
    // console.log(public_url)
    axios
      .post(public_url + '/login', params)
      .then(async response => {
        console.log(response)
        params.rememberMe ? window.localStorage.setItem('token', response.data.token) : null
        const returnUrl = router.query.returnUrl
        setUser({ ...response.data.data })
        params.rememberMe ? window.localStorage.setItem('userData', JSON.stringify(response.data.data)) : null
        const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
        router.replace(redirectURL)
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
