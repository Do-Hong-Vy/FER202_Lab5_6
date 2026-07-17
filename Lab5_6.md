Excution Command:
Run the Mock API using: json-server --watch database.json --port 9999
Run the React application on the default port(localhost:3000)

Funtional 1: Employee List Page (Home Page - /)

1. Display and synchronize relational data (join data)
   display the list of all employees.
   Employee Name: Concatenated from tow fields: empName.lastName and empName.firstName
   Department: Match the employee's depID with the departments list to find and display the corresponding department name(depName).
   Number of Dependents: Count the number of elements in the employee's dependents array.
2. Default Sorting
   By default, the employee list must be sorted in descending order of salary(empSalary) upon page load.
3. Search bar(Search)
   Allow users to enter search keywords.
   The system must filter and display the employee whose Last Name or First Name(firstName or lastName) contains the search term (case-insensitive).
4. Visual Department Filter (Sidebar Filter)
   Design a filter area (Sidebar) that displays the list of departments as checkboxes.
   When a user checks one or more department, the main employee list must immediately and dynamically update. If no checkboxes are selected, display all employees by default.
5. Delete function
   Provide a delete button next to each employee row.
   Clicking the delete button must trigger a confirmation dialog (confirm). If the user confirms, send a DELETE request to the API to remove the employee and immediately update the user interface.
   Funtional 2: Create New Employee Page (employee/create)
   Student must design a form to add a new employee to the system that meets the following standards:
6. Form Validation
   - First Name and Last Name: Required fields, cannot be left empty or contain only whitespace.
   - Salary (empSalary): Required field, must be a positive number greater than zero.
   - Department: Display as a dropdown selection (Select Option) populated dynamically with data from the departments list in the database. User must select a department.
   - If any field is invalid, display a red error message directly below that field and block the form submission.
7. Storage and Redirection Handling
   -Once the form data is valid, clicking Save will automatically assign default values to advanced fields: supervisorID: null and an array of dependents: [].
   - Send a POST request to save the new employee to json-server.
   - Upon successful save, display a success alert and automatically redirect the user back to the Home Page(/).
8. Cancel Button
   Provide a cancel button that allows the user to discard their changes and return to the Home Page.
   Function 4(Bonus/Advanced): Project and Working Hours Statistics
   Add a column name "Participating Projects (Total Hours)" to the main employee table on the Home Page.
   Calculate this field using relationship mapping between the bridge table workons and the projects table:
   Fill all records in the workons table where the empID matches the current employee's id.
   Retrieve the project name(proName) from the projects table using the corresponding proId.
   Calculate the total working hours (workHours) for that employee across all joined projects.
   Expected display format: Website Development (30 hours); Accounting Software (20 hours). If the employee has not participated in any project, display Has not participated.
