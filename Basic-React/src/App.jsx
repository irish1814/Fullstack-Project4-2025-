import TextInput from './Components/TextInput'
import './App.css'
import { Keyboard } from './Components/Keyboard'
import { TextFileManager } from './Components/FileManager'

function App() {
  return (
    <>
      <TextFileManager />
      <TextInput />
      <Keyboard />
    </>
  )
}

export default App
