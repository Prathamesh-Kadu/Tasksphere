import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { AuthProvider } from './context/AuthContext';
import ToastProvider from './components/toast/ToastProvider';

function App() {
  return (
    <>
      <ToastProvider />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
    </>
  );
}

export default App;