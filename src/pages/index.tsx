import { Navigate } from 'react-router-dom'
console.log('Navigate', Navigate)
function App() {
	return <Navigate to="app" replace />
}

export default App
