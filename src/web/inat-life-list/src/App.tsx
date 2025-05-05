import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LifeList from './components/LifeList.tsx'
import { BrowserRouter } from 'react-router-dom'

function App() {
    const queryClient = new QueryClient()

    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <LifeList />
            </QueryClientProvider>
        </BrowserRouter>
    )
}

export default App
