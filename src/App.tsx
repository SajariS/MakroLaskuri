import { useState } from 'react'
import LangProvider from './context/LangProvider'
import Header from './components/Header'
import TabsProvider from './context/TabsProvider'
import PageContainer from './pages/PageContainer'
import { Typography } from '@mui/material'

function App() {

  return (
    <LangProvider>
      <TabsProvider>
        <Header />
        <PageContainer />
        <Typography>TESTI</Typography>
      </TabsProvider>
    </LangProvider>
  )
}

export default App
