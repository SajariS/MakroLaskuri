import LangProvider from './context/LangProvider'
import Header from './components/Header'
import TabsProvider from './context/TabsProvider'
import PageContainer from './pages/PageContainer'
import { createTheme, ThemeProvider } from '@mui/material'

const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true
      }
    }
  }
})

function App() {

  return (
    <ThemeProvider theme={theme}>
      <LangProvider>
        <TabsProvider>
          <Header />
          <PageContainer />
        </TabsProvider>
      </LangProvider>
    </ThemeProvider>
  )
}

export default App
