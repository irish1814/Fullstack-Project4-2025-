import './App.css'
import SimpleKeyboard from './Components/Keyboard'
import { TextFileManager } from './Components/FileManager'
import TextDisplay from './Components/TextDisplay'

function App() {
  return (
    <>
      <TextFileManager />
      <TextDisplay />
      <SimpleKeyboard />
    </>
  )
}

export default App
