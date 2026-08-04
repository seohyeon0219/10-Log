import AppRouter from './routes/AppRouter'
import { useWebViewBridge } from './hooks/useWebViewBridge'

export default function App() {
  useWebViewBridge()
  return <AppRouter />
}
