import { useState } from "react";

const GrattaAdmin = () => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
        });
      };
    
      const [selectedCompany, setSelectedCompany] = useState(null);
      const [searchTerm, setSearchTerm] = useState("");
      const [currentView, setCurrentView] = useState("overview");
      const [selectedUser, setSelectedUser] = useState(null);
      const [companies] = useState([
        {
          id: 1,
          name: "TechCorp Inc.",
          plan: "Enterprise",
          status: "active",
          signupDate: "2025-01-15",
          totalUsers: 156,
          activeUsers: 143,
          monthlyPoints: 1000,
          monthlyPayment: 2499,
          users: [
            {
              id: 1,
              name: "Sarah Chen",
              email: "sarah.chen@techcorp.com",
              role: "admin",
              status: "active",
              lastLogin: "2025-02-01",
              pointsReceived: [
                {
                  from: "Mike Johnson",
                  amount: 50,
                  message: "Great presentation!",
                  date: "2025-02-01",
                },
                {
                  from: "David Kim",
                  amount: 25,
                  message: "Thanks for the help!",
                  date: "2025-01-30",
                },
              ],
              pointsGiven: [
                {
                  to: "Mike Johnson",
                  amount: 30,
                  message: "Excellent teamwork",
                  date: "2025-02-01",
                },
              ],
              pointsRedeemed: [
                { reward: "Amazon Gift Card", amount: 100, date: "2025-01-28" },
              ],
            },
            {
              id: 2,
              name: "Mike Johnson",
              email: "mike.johnson@techcorp.com",
              role: "member",
              status: "active",
              lastLogin: "2025-02-01",
              pointsReceived: [
                {
                  from: "Sarah Chen",
                  amount: 30,
                  message: "Excellent teamwork",
                  date: "2025-02-01",
                },
              ],
              pointsGiven: [
                {
                  to: "Sarah Chen",
                  amount: 50,
                  message: "Great presentation!",
                  date: "2025-02-01",
                },
              ],
              pointsRedeemed: [],
            },
          ],
        },
        {
          id: 2,
          name: "InnovateLabs",
          plan: "Basic",
          status: "active",
          signupDate: "2025-01-20",
          totalUsers: 45,
          activeUsers: 42,
          monthlyPoints: 500,
          monthlyPayment: 99,
          users: [
            {
              id: 3,
              name: "David Kim",
              email: "david.kim@innovatelabs.com",
              role: "admin",
              status: "active",
              lastLogin: "2025-02-01",
              pointsReceived: [],
              pointsGiven: [
                {
                  to: "Sarah Chen",
                  amount: 25,
                  message: "Thanks for the help!",
                  date: "2025-01-30",
                },
              ],
              pointsRedeemed: [],
            },
          ],
        },
      ]);
      const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F0533] to-[#000000] flex">
          <div className="w-64 bg-[#0F0533] shadow-lg flex flex-col">
            <div className="p-4 flex-grow">
              <div className="flex items-center justify-center mb-6">
                <a
                href="/">
                <img
                  src="https://ucarecdn.com/e65937ae-5fea-4158-9bde-d5b039e3b211/-/format/auto/"
                  alt="Grattia logo"
                  className="h-12 w-auto"
                />
                </a>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => setCurrentView("overview")}
                  className={`p-3 rounded-lg text-left ${
                    currentView === "overview"
                      ? "bg-[#7F31FB] text-white"
                      : "text-white hover:bg-[#7F31FB]/50"
                  }`}
                >
                  <i className="fas fa-chart-line mr-3"></i> Overview
                </button>
                <button
                  onClick={() => setCurrentView("users")}
                  className={`p-3 rounded-lg text-left ${
                    currentView === "users"
                      ? "bg-[#7F31FB] text-white"
                      : "text-white hover:bg-[#7F31FB]/50"
                  }`}
                >
                  <i className="fas fa-users mr-3"></i> Users
                </button>
              </div>
            </div>
          </div>
    
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 px-4 py-2 bg-[#0F0533] border border-[#7AFBF7]/20 rounded-lg text-white placeholder-[#9996AA] focus:outline-none focus:ring-2 focus:ring-[#FC36FF] focus:border-transparent"
                  />
                  <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9996AA]"></i>
                </div>
              </div>
    
              {currentView === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#0F0533] bg-opacity-50 p-6 rounded-xl border border-[#7AFBF7]/20">
                    <div className="text-[#7AFBF7] text-2xl mb-2">
                      <i className="fas fa-building"></i>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {companies.length}
                    </div>
                    <div className="text-[#9996AA]">Total Companies</div>
                  </div>
                  <div className="bg-[#0F0533] bg-opacity-50 p-6 rounded-xl border border-[#7AFBF7]/20">
                    <div className="text-[#7AFBF7] text-2xl mb-2">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {companies.reduce(
                        (acc, company) => acc + company.totalUsers,
                        0,
                      )}
                    </div>
                    <div className="text-[#9996AA]">Total Users</div>
                  </div>
                  <div className="bg-[#0F0533] bg-opacity-50 p-6 rounded-xl border border-[#7AFBF7]/20">
                    <div className="text-[#7AFBF7] text-2xl mb-2">
                      <i className="fas fa-user-check"></i>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      {companies.reduce(
                        (acc, company) => acc + company.activeUsers,
                        0,
                      )}
                    </div>
                    <div className="text-[#9996AA]">Active Users</div>
                  </div>
                  <div className="bg-[#0F0533] bg-opacity-50 p-6 rounded-xl border border-[#7AFBF7]/20">
                    <div className="text-[#7AFBF7] text-2xl mb-2">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="text-4xl font-bold text-white mb-2">
                      $
                      {companies
                        .reduce((acc, company) => acc + company.monthlyPayment, 0)
                        .toLocaleString()}
                    </div>
                    <div className="text-[#9996AA]">Monthly Revenue</div>
                  </div>
                </div>
              )}
    
              {currentView === "overview" && (
                <div className="bg-[#0F0533] bg-opacity-50 rounded-xl border border-[#7AFBF7]/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#7AFBF7]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Plan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Users
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Monthly Payment
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Sign Up Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#7AFBF7]/20">
                        {filteredCompanies.map((company) => (
                          <tr key={company.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white font-medium">
                                {company.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">
                              {company.plan}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white">
                                {company.activeUsers}/{company.totalUsers}
                              </div>
                              <div className="text-[#9996AA] text-sm">
                                Active Users
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-white">
                                ${company.monthlyPayment.toLocaleString()}
                              </div>
                              <div className="text-[#9996AA] text-sm">
                                per month
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-white">
                              {formatDate(company.signupDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {company.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <button
                                onClick={() => setSelectedCompany(company)}
                                className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors mr-4"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors">
                                <i className="fas fa-edit"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
    
              {currentView === "users" && (
                <div className="bg-[#0F0533] bg-opacity-50 rounded-xl border border-[#7AFBF7]/20">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-[#7AFBF7]/20">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Company
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            First Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Last Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#9996AA] uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#7AFBF7]/20">
                        {companies.flatMap((company) =>
                          company.users.map((user) => {
                            const [firstName, lastName] = user.name.split(" ");
                            return (
                              <tr key={`${company.id}-${user.id}`}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-white font-medium">
                                    {company.name}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                  {firstName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                  {lastName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-white">
                                  {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                    {user.role}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <button
                                    onClick={() => setSelectedUser(user)}
                                    className="text-[#7AFBF7] hover:text-[#FC36FF] transition-colors"
                                  >
                                    <i className="fas fa-chart-line"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          }),
                        )}
                      </tbody>
                    </table>
                  </div>
                  {selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                      <div className="bg-[#0F0533] rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="p-6 border-b border-[#7AFBF7]/20">
                          <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">
                              {selectedUser.name} - Activity Log
                            </h2>
                            <button
                              onClick={() => setSelectedUser(null)}
                              className="text-[#9996AA] hover:text-white transition-colors"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-3 gap-6">
                            <div>
                              <h3 className="text-white font-medium mb-4">
                                Points Received
                              </h3>
                              <div className="space-y-4">
                                {selectedUser.pointsReceived.map(
                                  (activity, index) => (
                                    <div
                                      key={index}
                                      className="bg-[#0F0533] bg-opacity-50 p-4 rounded-lg border border-[#7AFBF7]/20"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-[#7AFBF7]">
                                          From: {activity.from}
                                        </span>
                                        <span className="text-green-400">
                                          +{activity.amount}
                                        </span>
                                      </div>
                                      <p className="text-white text-sm mb-2">
                                        {activity.message}
                                      </p>
                                      <p className="text-[#9996AA] text-xs">
                                        {formatDate(activity.date)}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-white font-medium mb-4">
                                Points Given
                              </h3>
                              <div className="space-y-4">
                                {selectedUser.pointsGiven.map((activity, index) => (
                                  <div
                                    key={index}
                                    className="bg-[#0F0533] bg-opacity-50 p-4 rounded-lg border border-[#7AFBF7]/20"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <span className="text-[#7AFBF7]">
                                        To: {activity.to}
                                      </span>
                                      <span className="text-red-400">
                                        -{activity.amount}
                                      </span>
                                    </div>
                                    <p className="text-white text-sm mb-2">
                                      {activity.message}
                                    </p>
                                    <p className="text-[#9996AA] text-xs">
                                      {formatDate(activity.date)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-white font-medium mb-4">
                                Points Redeemed
                              </h3>
                              <div className="space-y-4">
                                {selectedUser.pointsRedeemed.map(
                                  (activity, index) => (
                                    <div
                                      key={index}
                                      className="bg-[#0F0533] bg-opacity-50 p-4 rounded-lg border border-[#7AFBF7]/20"
                                    >
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-[#7AFBF7]">
                                          {activity.reward}
                                        </span>
                                        <span className="text-yellow-400">
                                          -{activity.amount}
                                        </span>
                                      </div>
                                      <p className="text-[#9996AA] text-xs">
                                        {formatDate(activity.date)}
                                      </p>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
    
              {selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                  <div className="bg-[#0F0533] rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                    <div className="p-6 border-b border-[#7AFBF7]/20">
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">
                          {selectedCompany.name}
                        </h2>
                        <button
                          onClick={() => setSelectedCompany(null)}
                          className="text-[#9996AA] hover:text-white transition-colors"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="text-[#9996AA] text-sm">Plan</div>
                          <div className="text-white font-medium">
                            {selectedCompany.plan}
                          </div>
                        </div>
                        <div>
                          <div className="text-[#9996AA] text-sm">
                            Monthly Points
                          </div>
                          <div className="text-white font-medium">
                            {selectedCompany.monthlyPoints}
                          </div>
                        </div>
                      </div>
                      <div className="mb-6">
                        <h3 className="text-white font-medium mb-4">Users</h3>
                        <div className="space-y-4">
                          {selectedCompany.users.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <div className="text-white font-medium">
                                  {user.name}
                                </div>
                                <div className="text-[#9996AA] text-sm">
                                  {user.email}
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    user.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {user.status}
                                </span>
                                <span className="text-[#9996AA] text-sm">
                                  Last login: {formatDate(user.lastLogin)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );

  }
  export default GrattaAdmin