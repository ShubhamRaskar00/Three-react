import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { Pagination } from '../../components';
function Users() {
  // Mock data - replace with real data from your backend
  const [users, setUsers] = useState([
    { id: 1, fullName: 'John Doe', email: 'johndoe@gmail.com', revenue: 1500, isActive: true },
    { id: 2, fullName: 'Jane Smith', email: 'janesmith@gmail.com', revenue: 2200, isActive: false },
    { id: 3, fullName: 'Bob Johnson', email: 'bobjohnson@gmail.com', revenue: 1800, isActive: true },
    { id: 4, fullName: 'Alice Brown', email: 'alicebrown@gmail.com', revenue: 3000, isActive: true },
    { id: 5, fullName: 'Charlie Davis', email: 'charliedavis@gmail.com', revenue: 2500, isActive: false },
    // Add more mock users here...
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    document.title = "Users";
  }, []);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
    // Here you would also send a request to your backend to update the user's status
    // and send an email notification
    console.log(`Toggled status for user ${userId}. Email notification sent.`);
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    // Here you would also send a request to your backend to delete the user
    console.log(`Deleted user ${userId}`);
  };

  const formatEmail = (email) => {
    const [localPart, domain] = email.split('@');
    return `${localPart.slice(0, 4)}...@${domain}`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Users</h1>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatEmail(user.email)}</td>
                <td className="px-6 py-4 whitespace-nowrap">${user.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Switch
                    checked={user.isActive}
                    onChange={() => toggleUserStatus(user.id)}
                    className={`${
                      user.isActive ? 'bg-green-600' : 'bg-gray-200'
                    } relative inline-flex items-center h-6 rounded-full w-11`}
                  >
                    <span className="sr-only">Toggle user status</span>
                    <span
                      className={`${
                        user.isActive ? 'translate-x-6' : 'translate-x-1'
                      } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out`}
                    />
                  </Switch>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        usersPerPage={usersPerPage}
        totalUsers={users.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}


export default Users;