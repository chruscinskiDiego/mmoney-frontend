import { BrowserRouter } from "react-router-dom"
import { AppContextProvider } from "./contexts/AppContext"
import { Router } from "./Router"
import { ChakraProvider } from "@chakra-ui/react"


function App() {


  return (
    <>
      <BrowserRouter>
        <AppContextProvider>
          <ChakraProvider>
            <Router />
          </ChakraProvider>
        </AppContextProvider>
      </BrowserRouter>
    </>
  )
}

export default App
