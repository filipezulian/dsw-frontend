import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MyRoutes from './MyRoutes'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider, theme } from 'antd'
import GlobalData from './GlobalData'

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <GlobalData>
          <BrowserRouter>
            <AuthProvider>
              <MyRoutes />
              <ToastContainer />
            </AuthProvider>
          </BrowserRouter>
        </GlobalData>
      </ConfigProvider>
    </div>
  )
}

export default App
