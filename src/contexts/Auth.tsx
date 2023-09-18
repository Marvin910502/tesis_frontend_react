import { createContext, ReactNode, useEffect, useReducer } from 'react'
// utils

// @types
import { ActionMap, AuthState, AuthUser, JWTContextType } from '../@types/auth'
import { loginOdoo, logoutOdoo, meOdoo } from 'src/api/queries'
import useLocales from 'src/hooks/useLocales'

// ----------------------------------------------------------------------

enum Types {
  Initial = 'INITIALIZE',
  Login = 'LOGIN',
  Logout = 'LOGOUT',
  Register = 'REGISTER',
}

type JWTAuthPayload = {
  [Types.Initial]: {
    isAuthenticated: boolean;
    user: AuthUser;
  };
  [Types.Login]: {
    user: AuthUser;
  };
  [Types.Logout]: undefined;
  [Types.Register]: {
    user: AuthUser;
  };
};

export type JWTActions = ActionMap<JWTAuthPayload>[keyof ActionMap<JWTAuthPayload>];

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
}

const JWTReducer = (state: AuthState, action: JWTActions) => {
  switch (action.type) {
    case 'INITIALIZE':

      return {
        isAuthenticated: action?.payload?.isAuthenticated || false,
        isInitialized: true,
        user: action.payload.user
      }
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      }
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isInitialized: true,
        user: null
      }

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      }

    default:
      return state
  }
}

const AuthContext = createContext<JWTContextType | null>(null)

// ----------------------------------------------------------------------

type AuthProviderProps = {
  children: ReactNode;
};

function AuthProvider ({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(JWTReducer, initialState)

  const { onChangeLang, allLang } = useLocales()
  const initialize = () => {
    return meOdoo().then((res) => {
      dispatch({
        type: Types.Initial,
        payload: {
          isAuthenticated: true,
          user: res
        }
      })
    }).catch((err) => {
      dispatch({
        type: Types.Logout
      })
      throw err
    })
  }
  useEffect(() => {
    initialize()
  }, [])

  const login = (email: string, password: string) => {
    return loginOdoo({ email, password }).then((res) => {
      dispatch({
        type: Types.Login,
        payload: {
          user: res
        }
      })
      const lang = allLang.find(({ lang }) => lang === res.user_context.lang)?.value as string || window.localStorage.getItem('i18nextLng') as string
      onChangeLang(lang)
    }).catch((err) => {
      throw err
    })
    // const user = response
    // dispatch({
    //   type: Types.Login,
    //   payload: {
    //     user
    //   }
    // })
    // const lang = allLang.find(({ lang }) => lang === user.lang)?.value as string || window.localStorage.getItem('i18nextLng') as string
    // onChangeLang(lang)
  }

  // const register = async (email: string, password: string, firstName: string, lastName: string) => {
  //   const response = await axios.post('/api/account/register', {
  //     email,
  //     password,
  //     firstName,
  //     lastName
  //   })
  //   const { accessToken, user } = response.data
  //
  //   window.localStorage.setItem('accessToken', accessToken)
  //   dispatch({
  //     type: Types.Register,
  //     payload: {
  //       user
  //     }
  //   })
  // }

  const logout = () => {
    // setSession(null)
    return logoutOdoo().then(() => dispatch({ type: Types.Logout })).catch((err) => {
      throw err
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout
        // register
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
