import { useState } from "react"
import Context from "./Context.jsx"

const Provider = ({children}) => {
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState()
    const [role, setRole] = useState()
    const [pageloaded, setPageloaded] = useState(false)

    return(
        <Context.Provider value={{authenticated, setAuthenticated, role, setRole, pageloaded, setPageloaded, user, setUser}}>
            {children}
        </Context.Provider>
    )
}

export default Provider