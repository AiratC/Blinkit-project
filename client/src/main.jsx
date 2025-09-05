import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './route/index'
import { RouterProvider } from 'react-router-dom'
import { store } from './store/store.js'
import { Provider } from 'react-redux'



createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </Provider>
)
