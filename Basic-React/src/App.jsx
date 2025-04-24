import './App.css'
import Keyboard from './Components/Keyboard'
import { TextFileManager } from './Components/FileManager'
import TextDisplay from './Components/TextDisplay'

function App() {
  return (
    <>
      <TextFileManager />
      <TextDisplay />
      <Keyboard />
    </>
  )
}

export default App
