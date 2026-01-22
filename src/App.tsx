import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import LangProvider from './context/LangProvider'
import TestiComp from './components/TestiComp'
import AddItem from './components/AddItem'
import Header from './components/Header'
import ItemCard from './components/ItemCard'
import { drinkHandler } from './services/drinkHandler'

function App() {
  const [count, setCount] = useState(0)

  return (
    <LangProvider>
      <Header />
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <TestiComp/>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <AddItem />
      <ItemCard item={drinkHandler.createDefault()} />
    </LangProvider>
  )
}

export default App
