import './App.css'
import { CallSchedulerProvider } from './context/CallSchedulerContext';
import CallScheduler from './pages/CallScheduler'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datepicker/dist/react-datepicker.css";
import "react-loading-skeleton/dist/skeleton.css";

function App() {
  return (
    <CallSchedulerProvider>
      <CallScheduler />
    </CallSchedulerProvider>
  )
}

export default App
