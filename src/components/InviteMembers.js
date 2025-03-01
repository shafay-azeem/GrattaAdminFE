import React, { useEffect, useRef, useState } from "react";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import Toast from "../Hooks/Toast";
import axios from "axios";

const InviteMembers = () => {
  const storeCompanyId = localStorage.getItem("companyId");
  const fileInputRef = useRef(null);
  const [file, setFile] = useState("");
  const [fileName, setFileName] = useState();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("");
  const [csvFile, setCsvFile] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false); // State to trigger API call
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [downloadData, setDownloadData] = useState([]);

  useEffect(() => {
    const request = axios.CancelToken.source();
    getUsersByCompany(request, storeCompanyId);
    return () => request.cancel();
  }, [refreshData]);

  const getUsersByCompany = async (request, id) => {
    if (loading) return;
    try {
      setLoading(true);
      const getUsersByCompanyResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_USERS_BY_COMPANY_ID + id,
        request
      );
      if (getUsersByCompanyResponse.status === 200) {
        setTeamMembers(getUsersByCompanyResponse?.data?.users);

        setLoading(false);
      } else {
        if (axios.isCancel(getUsersByCompanyResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getUsersByCompanyResponse.response.data.message,
            "error",
            getUsersByCompanyResponse.response.status
          );
          successToast.show();
        }
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      // Set loading to false to re-enable button after the request is done
      setLoading(false);
    }
  };
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button
    const newMember = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      companyId: storeCompanyId,
      role: role,
    };

    try {
      let inviteResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.INVITE_USER,
        newMember
      );
      if (inviteResponse.status === 201 || inviteResponse.status === 200) {
        const successToast = new Toast(
          inviteResponse.data.message,
          "success",
          inviteResponse.status
        );
        successToast.show();

        // Clear form fields after successful submission
        setFirstName("");
        setLastName("");
        setEmail("");
        setCompanyId("");
        setRole("admin"); // Reset to default role

        // Trigger API refresh
        setRefreshData((prev) => !prev);
      } else {
        const successToast = new Toast(
          inviteResponse.response.data.message,
          "error",
          inviteResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      "email,firstName,lastName,role\njohn.doe@example.com,John,Doe,member\njane.smith@example.com,Jane,Smith,admin";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteMember = async (id) => {
    try {
      const deleteUserResponse = await apiFunctions.DELETE_REQUEST(
        BASE_URL + API_URL.DELETE_USER_BY_ID + id
      );
      if (deleteUserResponse.status === 200) {
        const successToast = new Toast(
          deleteUserResponse.data.message,
          "success",
          deleteUserResponse.status
        );
        successToast.show();
        setRefreshData((prev) => !prev);
      } else {
        const successToast = new Toast(
          deleteUserResponse.response.data.message,
          "error",
          deleteUserResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
      // console.log(error);
    }
  };

  const handleFileChange = async () => {
    const file = fileInputRef.current.files[0];

    if (file) {
      console.log("Selected file:", file);
      setFileName();
      setFile(file);
    }
  };

  const uploadCsvFile = async () => {
    if (isButtonDisabled) return;
    if (!file) {
      const errorToast = new Toast("Please upload a file first", "error", 400);
      errorToast.show();
      return;
    }
    const file1 = fileInputRef.current.files[0];
    if (file1) {
      const formData = new FormData();

      formData.append("inviteFile", file1);

      try {
        setIsButtonDisabled(true);
        let response = await apiFunctions.POST_REQUEST(
          BASE_URL + API_URL.BULK_INVITE,
          formData,
          true
        );

        if (response.status === 201 || response.status === 200) {
          // setDownloadData(response?.data?.users || []);
          setFileName(response?.data?.fileName);
          fileInputRef.current.value = "";
          setFile("");
          const successToast = new Toast(
            response.data.message,
            "success",
            response.status
          );
          successToast.show();
          // Trigger API refresh
          setRefreshData((prev) => !prev);
        } else {
          setFile("");
          const successToast = new Toast(
            response.response.data.message,
            "error",
            response.response.status
          );
          successToast.show();
        }
      } catch (error) {
        const successToast = new Toast("Internal Server Error", "error", 500);
        successToast.show();
      } finally {
        setIsButtonDisabled(false); // Enable button again after response is received
      }
    } else {
      console.log("No file selected.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Invite Team Members</h3>
          <form onSubmit={handleInviteSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="team_member">Team Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </form>

          <div className="mt-6 p-4 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Bulk Upload Users</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV file with columns: email, firstName, lastName, role
              (member/admin)
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleDownloadTemplate}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center"
              >
                <i className="fas fa-download mr-2"></i>
                Download CSV Template
              </button>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  name="file"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <button
                  onClick={uploadCsvFile}
                  disabled={isButtonDisabled}
                  className={`w-48 px-4 py-2 rounded-lg text-sm ${
                    isButtonDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isButtonDisabled ? "Uploading..." : "Upload CSV"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Current Team Members</h3>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center w-full">
                <p className="text-gray-500 text-lg font-medium">Loading...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Invited
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers?.map((member, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {member.role}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {member.status === "active"
                            ? "Active"
                            : "Invite Sent"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(member.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleDeleteMember(member._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteMembers;
