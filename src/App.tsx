import './App.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MyRoutes from './MyRoutes'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider, theme } from 'antd'

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        <BrowserRouter>
          <AuthProvider>
            <MyRoutes />
            <ToastContainer />
          </AuthProvider>
        </BrowserRouter>
      </ConfigProvider>
    </div>
  )
}

export default App
