import { Routes, Route } from 'react-router-dom';
import EmployeeList from './Components/EmployeeList';
import CreateEmployee from './Components/CreateEmployee';
import EmployeeDetail from './Components/EmployeeDetail';
import EditEmployee from './Components/EditEmployee';

function App() {
    return (
        <Routes>
            <Route path="/" element={<EmployeeList />} />
            <Route path="/employee/create" element={<CreateEmployee />} />
            <Route path="/employee/detail/:id" element={<EmployeeDetail />} />
            <Route path="/employee/edit/:id" element={<EditEmployee />} />
        </Routes>
    );
}

export default App;