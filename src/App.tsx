import { ToastContainer } from "react-toastify";
import Routers from "./routes/Routers";

function App() {
  
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Routers />
    </>
  );
}

export default App;
