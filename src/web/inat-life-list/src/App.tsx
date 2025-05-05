import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LifeList from './components/LifeList.tsx'

function App() {
    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <LifeList />
        </QueryClientProvider>
    )
}

export default App
