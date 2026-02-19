import LangProvider from './context/LangProvider'
import Header from './components/Header'
import TabsProvider from './context/TabsProvider'
import PageContainer from './pages/PageContainer'

function App() {

  return (
    <LangProvider>
      <TabsProvider>
        <Header />
        <PageContainer />
      </TabsProvider>
    </LangProvider>
  )
}

export default App
