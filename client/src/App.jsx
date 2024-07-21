import "./App.css";
import { BrowserRouter , Routes , Route} from 'react-router-dom'
import Home from "./Pages/Home.jsx";
import EditorPage from "./Pages/EditorPage.jsx";
import { Toaster } from "react-hot-toast";
function App() {
  return (
   <>
    <div>
      <Toaster/>
    </div>
     <BrowserRouter>
    <Routes>

      <Route path="/" element={<Home/>} />
      <Route path="/editor/:roomId" element={<EditorPage/>} />
    </Routes>
    </BrowserRouter>
   
   </>
  );
}

export default App;
