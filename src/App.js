import { Routes, Route } from 'react-router-dom';
import EmployeeList from './Components/EmployeeList';
import CreateEmployee from './Components/CreateEmployee';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/employee/create" element={<CreateEmployee />} />
        </Routes>
    );
}

export default App;