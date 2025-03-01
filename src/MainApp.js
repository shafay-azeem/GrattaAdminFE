import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiFunctions from "./global/GlobalFunction";
import { API_URL, BASE_URL } from "./global/Constant";
import Toast from "./Hooks/Toast";
import axios from "axios";
import InviteMembers from "./components/InviteMembers";
import PointsDistForm from "./components/PointsDistForm.js";
import CompActivityCard from "./components/CompActivityCard.js";

function MainApp() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [points, setPoints] = useState(1250);
  const [pointsToGive, setPointsToGive] = useState();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentView, setCurrentView] = useState("give");
  const [isAdmin, setIsAdmin] = useState("");

  const [loading, setLoading] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [showUserSuggestions, setShowUserSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [pointsInput, setPointsInput] = useState("");
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@company.com",
      role: "admin",
      status: "active",
      dateInvited: "2025-01-10",
    },
    {
      id: 2,
      firstName: "Mike",
      lastName: "Johnson",
      email: "mike.johnson@company.com",
      role: "member",
      status: "invite-sent",
      dateInvited: "2025-01-15",
    },
    {
      id: 3,
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@company.com",
      role: "member",
      status: "active",
      dateInvited: "2025-01-12",
    },
  ]);

  const [personalActivity] = useState([
    {
      id: 1,
      from: "Sarah Chen",
      points: 50,
      message: "Great presentation! 🎉",
      date: "2025-01-15",
    },
    {
      id: 2,
      from: "Mike Johnson",
      points: 25,
      message: "Thanks for helping with the project 🙌",
      date: "2025-01-14",
    },
  ]);

  const emojis = [
    "👍",
    "🎉",
    "🌟",
    "🙌",
    "💪",
    "👏",
    "🚀",
    "💯",
    "🏆",
    "⭐️",
    "🎯",
    "💡",
  ];

  const [companyActivity, setCompanyActivity] = useState([
    {
      id: 1,
      from: "You",
      to: "Maria Garcia",
      points: 100,
      message: "Outstanding leadership on the Q1 launch! 🚀",
      date: "2025-01-15",
    },
    {
      id: 2,
      from: "Jamie Lee",
      to: "Chris Wilson",
      points: 75,
      message: "Thanks for mentoring the new team members 🌟",
      date: "2025-01-14",
    },
    {
      id: 3,
      from: "You",
      to: "David Kim",
      points: 50,
      message: "Great help with the client presentation 👏",
      date: "2025-01-13",
    },
    {
      id: 4,
      from: "You",
      to: "Sarah Chen",
      points: 25,
      message: "Thanks for covering my meetings today! 🙌",
      date: "2025-01-12",
    },
  ]);

  useEffect(() => {
    // Retrieve role from localStorage
    const storedRole = localStorage.getItem("role");
    if (storedRole) {
      setIsAdmin(storedRole);
    }
  }, []);

  useEffect(() => {
    const request = axios.CancelToken.source();

    getUserDetail(request);
    return () => request.cancel(); // (*)
  }, []);

  useEffect(() => {
    const request = axios.CancelToken.source();

    getUsersCompanyPoints(request);
    return () => request.cancel(); // (*)
  }, [currentView]);

  const getUsersCompanyPoints = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const getUsersCompanyPointsResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_USER_COMPANY_POINTS,
        request
      );
      if (getUsersCompanyPointsResponse.status === 200) {
        setPointsToGive(getUsersCompanyPointsResponse?.data?.companyPoints);
        setLoading(false);
      } else {
        if (axios.isCancel(getUsersCompanyPointsResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getUsersCompanyPointsResponse.response.data.message,
            "error",
            getUsersCompanyPointsResponse.response.status
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

  const getUserDetail = async (request) => {
    try {
      const userDetailResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.USER_DETAIL,
        request
      );

      if (userDetailResponse.status === 200) {
        // console.log(userDetailResponse?.data?.user, "userDetailResponse");
        const res = userDetailResponse?.data?.user;
        setFirstName(res.firstName);
        setLastName(res.lastName);
      } else {
        if (axios.isCancel(userDetailResponse)) {
          // Handle the cancellation here
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            userDetailResponse.response.data.message,
            "error",
            userDetailResponse.response.status
          );
          successToast.show();
        }
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    }
  };

  const handleLogout = () => {
    // Clear all stored data in localStorage
    localStorage.clear();

    // Navigate to the login page
    navigate("/loginpage");
  };

  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    setMessage(newMessage);

    const lastAtSymbol = newMessage.lastIndexOf("@");
    if (lastAtSymbol !== -1) {
      const query = newMessage.slice(lastAtSymbol + 1).toLowerCase();
      const pointsMatch = query.match(/\+(\d+)/);
      if (pointsMatch) {
        setPointsInput(pointsMatch[1]);
        const cleanQuery = query.replace(/\+\d+/, "").trim();
        const filtered = teamMembers.filter(
          (member) =>
            member.status === "active" &&
            (member.email.toLowerCase().includes(cleanQuery) ||
              `${member.firstName} ${member.lastName}`
                .toLowerCase()
                .includes(cleanQuery))
        );
        setFilteredUsers(filtered);
        setShowUserSuggestions(true);
      } else {
        const filtered = teamMembers.filter(
          (member) =>
            member.status === "active" &&
            (member.email.toLowerCase().includes(query) ||
              `${member.firstName} ${member.lastName}`
                .toLowerCase()
                .includes(query))
        );
        setFilteredUsers(filtered);
        setShowUserSuggestions(true);
      }
    } else {
      setShowUserSuggestions(false);
    }
  };

  const handleUserSelect = (user) => {
    const lastAtSymbol = message.lastIndexOf("@");
    const beforeAt = message.slice(0, lastAtSymbol);
    const afterAt = message.slice(lastAtSymbol + 1);
    const pointsMatch = afterAt.match(/\+(\d+)/);
    if (pointsMatch) {
      setPointsInput(pointsMatch[1]);
      const cleanMessage = beforeAt.trim();
      setMessage(cleanMessage);
    } else {
      setMessage(beforeAt.trim());
    }
    setSelectedUser(user);
    setShowUserSuggestions(false);
  };

  const handleEmojiClick = (emoji) => {
    setMessage(message + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser || !pointsInput) return;

    const pointsAmount = parseInt(pointsInput);
    if (pointsAmount > pointsToGive) return;

    const newActivity = {
      id: companyActivity.length + 1,
      from: "You",
      to: `${selectedUser.firstName} ${selectedUser.lastName}`,
      points: pointsAmount,
      message: message,
      date: new Date().toISOString().split("T")[0],
    };

    setCompanyActivity([newActivity, ...companyActivity]);
    setPointsToGive((prev) => prev - pointsAmount);
    setMessage("");
    setSelectedUser(null);
    setPointsInput("");
  };

  const handleEditMessage = (activity) => {
    setEditingActivity(activity);
    setEditMessage(activity.message);
  };

  const handleCancelEdit = () => {
    setEditingActivity(null);
    setEditMessage("");
  };

  const handleSaveEdit = (activityId) => {
    setCompanyActivity(
      companyActivity.map((activity) =>
        activity.id === activityId
          ? { ...activity, message: editMessage }
          : activity
      )
    );
    setEditingActivity(null);
    setEditMessage("");
  };

  const handleUndoPoints = (activity) => {
    setCompanyActivity(companyActivity.filter((a) => a.id !== activity.id));
    setPointsToGive((prev) => prev + activity.points);
  };

  const [rewards] = useState([
    {
      id: 1,
      name: "Amazon Gift Card",
      points: 1000,
      image: "/amazon-card.jpg",
      description: "Redeem for shopping on Amazon",
      date: "2025-01-10",
      redeemed: true,
    },
    {
      id: 2,
      name: "Starbucks Gift Card",
      points: 500,
      image: "/starbucks-card.jpg",
      description: "Get your favorite coffee",
    },
    {
      id: 3,
      name: "Target Gift Card",
      points: 750,
      image: "/target-card.jpg",
      description: "Shop at Target stores",
    },
    {
      id: 4,
      name: "Extra PTO Day",
      points: 2000,
      image: "/pto-day.jpg",
      description: "Take an extra day off",
    },
  ]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    let updateBody = {
      firstName: firstName,
      lastName: lastName,
    };

    try {
      let updateProfileResponse = await apiFunctions.PUT_REQUEST(
        BASE_URL + API_URL.UPDATE_PROFILE,
        updateBody
      );
      if (
        updateProfileResponse.status === 201 ||
        updateProfileResponse.status === 200
      ) {
        const successToast = new Toast(
          updateProfileResponse.data.message,
          "success",
          updateProfileResponse.status
        );
        successToast.show();
      } else {
        const successToast = new Toast(
          updateProfileResponse.response.data.message,
          "error",
          updateProfileResponse.response.status
        );
        successToast.show();
      }
    } catch (error) {
      const successToast = new Toast("Internal Server Error", "error", 500);
      successToast.show();
    } finally {
      // Set loading to false to re-enable button after the request is done
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Fixed Position */}
      <div className="w-64 bg-[#0F0533] shadow-lg flex flex-col h-screen fixed">
        <div className="p-4 flex-grow">
          <div className="flex items-center justify-center mb-6">
            <a href="/">
              <img
                src="https://ucarecdn.com/89c130ef-6083-4ba2-a20d-ef5c56a5150c/-/format/auto/"
                alt="Company logo"
                className="h-12 w-auto"
              />
            </a>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => setCurrentView("give")}
              className={`p-3 rounded-lg text-left ${
                currentView === "give"
                  ? "bg-[#7F31FB] text-white"
                  : "text-white hover:bg-[#7F31FB]/50"
              }`}
            >
              <i className="fas fa-gift mr-3"></i> Give Points
            </button>
            <button
              onClick={() => setCurrentView("company")}
              className={`p-3 rounded-lg text-left ${
                currentView === "company"
                  ? "bg-[#7F31FB] text-white"
                  : "text-white hover:bg-[#7F31FB]/50"
              }`}
            >
              <i className="fas fa-building mr-3"></i> Company Activity
            </button>
            <button
              onClick={() => setCurrentView("personal")}
              className={`p-3 rounded-lg text-left ${
                currentView === "personal"
                  ? "bg-[#7F31FB] text-white"
                  : "text-white hover:bg-[#7F31FB]/50"
              }`}
            >
              <i className="fas fa-user mr-3"></i> Your Activity
            </button>
            <button
              onClick={() => setCurrentView("rewards")}
              className={`p-3 rounded-lg text-left ${
                currentView === "rewards"
                  ? "bg-[#7F31FB] text-white"
                  : "text-white hover:bg-[#7F31FB]/50"
              }`}
            >
              <i className="fas fa-award mr-3"></i> Rewards
            </button>
            <button
              onClick={() => setCurrentView("transactions")}
              className="w-full bg-[#FC36FF] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#FC36FF]/80 transition-colors"
            >
              {points} Points Available
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-[#7AFBF7]/20">
          {isAdmin === "admin" && (
            <div className="">
              <button
                onClick={() => setCurrentView("users")}
                className={`w-full p-3 rounded-lg text-left ${
                  currentView === "users"
                    ? "bg-[#7F31FB] text-white"
                    : "text-white hover:bg-[#7F31FB]/50"
                }`}
              >
                <i className="fas fa-users mr-3"></i> Users
              </button>

              <button
                onClick={() => setCurrentView("settings")}
                className={`w-full p-3 rounded-lg text-left ${
                  currentView === "settings"
                    ? "bg-[#7F31FB] text-white"
                    : "text-white hover:bg-[#7F31FB]/50"
                }`}
              >
                <i className="fas fa-cog mr-3"></i> Settings
              </button>
            </div>
          )}

          <button
            onClick={() => setCurrentView("update profile")}
            className={`w-full p-3 rounded-lg text-left ${
              currentView === "update profile"
                ? "bg-[#7F31FB] text-white"
                : "text-white hover:bg-[#7F31FB]/50"
            }`}
          >
            <i className="fas fa-user-edit mr-3"></i> Update Profile
          </button>

          <button
            onClick={handleLogout}
            className={`w-full p-3 rounded-lg text-left ${
              currentView === "logout"
                ? "bg-[#7F31FB] text-white"
                : "text-white hover:bg-[#7F31FB]/50"
            }`}
          >
            <i className="fas fa-sign-out-alt mr-3"></i> Logout
          </button>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="ml-64 flex-1 overflow-y-auto h-screen p-6">
        <div className="flex-1 flex justify-center p-8">
          <div className="w-full max-w-4xl">
            {currentView === "give" && (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Give Points</h2>
                    <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                      <span className="text-indigo-600 font-semibold">
                        {pointsToGive !== undefined && pointsToGive !== null
                          ? `${pointsToGive} Points Available To Give`
                          : "Fetching available points..."}
                      </span>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Points to Give
                        </label>
                        <input
                          type="number"
                          value={pointsInput}
                          onChange={(e) => setPointsInput(e.target.value)}
                          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Enter points amount"
                          min="1"
                          max={pointsToGive}
                        />
                      </div>
                      <textarea
                        value={message}
                        onChange={handleMessageChange}
                        className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="@ someone and write your message"
                        rows={4}
                        name="message"
                      />
                      {showUserSuggestions && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredUsers.map((user) => (
                            <button
                              key={user.id}
                              type="button"
                              onClick={() => handleUserSelect(user)}
                              className="w-full px-4 py-2 text-left hover:bg-gray-50"
                            >
                              <span className="font-medium">
                                {user.email.split("@")[0]}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                - {user.email}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                        >
                          <i className="fas fa-smile"></i>
                        </button>
                      </div>
                    </div>

                    {showEmojiPicker && (
                      <div className="p-2 bg-white border rounded-lg shadow-lg">
                        <div className="grid grid-cols-6 gap-2">
                          {emojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => handleEmojiClick(emoji)}
                              className="text-2xl hover:bg-gray-100 p-2 rounded"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        !selectedUser || !pointsInput || !message.trim()
                      }
                      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Give Points
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">Points Given</h2>
                  <div className="space-y-4">
                    {companyActivity
                      .filter((activity) => activity.from === "You")
                      .map((activity) => (
                        <div key={activity.id} className="border-b pb-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="bg-blue-50 px-2 py-1 rounded-md">
                                <p className="font-medium text-blue-600">
                                  {activity.to}
                                </p>
                              </div>
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                                -{activity.points} points
                              </span>
                              <p className="text-xs text-gray-500">
                                {formatDate(activity.date)}
                              </p>
                              <div className="ml-auto flex gap-2">
                                <button
                                  onClick={() => handleEditMessage(activity)}
                                  className="text-indigo-600 hover:text-indigo-700"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleUndoPoints(activity)}
                                  className="text-red-600 hover:text-red-700"
                                  title="Undo points"
                                >
                                  <i className="fas fa-undo"></i>
                                </button>
                              </div>
                            </div>
                            {editingActivity?.id === activity.id ? (
                              <div className="mt-2">
                                <textarea
                                  value={editMessage}
                                  onChange={(e) =>
                                    setEditMessage(e.target.value)
                                  }
                                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                  rows={2}
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSaveEdit(activity.id)}
                                    className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-gray-600 break-words">
                                  {activity.message}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </>
            )}

            {currentView === "personal" && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">
                  Your Points History
                </h2>
                <div className="space-y-4">
                  {personalActivity.map((activity) => (
                    <div key={activity.id} className="border-b pb-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="bg-blue-50 px-2 py-1 rounded-md">
                            <p className="font-medium text-blue-600">
                              {activity.from}
                            </p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            +{activity.points} points
                          </span>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.date)}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-gray-600 break-words">
                            {activity.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === "company" && <CompActivityCard />}

            {currentView === "rewards" && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">Rewards Catalog</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={reward.image}
                        alt={reward.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-lg font-semibold">{reward.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {reward.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-indigo-600 font-semibold">
                          {reward.points} points
                        </span>
                        <button
                          className={`px-4 py-2 rounded-lg ${
                            points >= reward.points
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                          disabled={points < reward.points}
                        >
                          Redeem
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentView === "transactions" && (
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-2xl font-semibold mb-6">
                  Points Transactions
                </h2>
                <div className="space-y-4">
                  {[...personalActivity, ...rewards.filter((r) => r.redeemed)]
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((activity) => (
                      <div key={activity.id} className="border-b pb-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            {activity.name ? (
                              <>
                                <div className="bg-blue-50 px-2 py-1 rounded-md">
                                  <p className="font-medium text-blue-600">
                                    Redeemed {activity.name}
                                  </p>
                                </div>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                                  -{activity.points} points
                                </span>
                              </>
                            ) : (
                              <>
                                <span>Received from</span>
                                <div className="bg-blue-50 px-2 py-1 rounded-md">
                                  <p className="font-medium text-blue-600">
                                    {activity.from}
                                  </p>
                                </div>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                  +{activity.points} points
                                </span>
                              </>
                            )}
                            <p className="text-xs text-gray-500">
                              {formatDate(activity.date)}
                            </p>
                          </div>
                          {activity.message && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-gray-600 break-words">
                                {activity.message}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {currentView === "update profile" && (
              <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Update Profile</h2>
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="relative">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled=""
                    className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Update
                  </button>
                </form>
              </div>
            )}

            {currentView === "settings" && (
              // <div className="bg-white p-6 rounded-xl shadow-sm">
              //   <h2 className="text-2xl font-semibold mb-6">
              //     Company Settings
              //   </h2>
              //   <div className="space-y-6">
              //     <div>
              //       <h3 className="text-lg font-semibold mb-4">
              //         Company Information
              //       </h3>
              //       <div className="space-y-4">
              //         <div>
              //           <label className="block text-sm font-medium text-gray-700 mb-1">
              //             Company Name
              //           </label>
              //           <input
              //             type="text"
              //             name="companyName"
              //             value={companyName} // Set value from state
              //             disabled // Make input field read-only
              //             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              //             placeholder="Enter company name"
              //           />
              //         </div>
              //         <div>
              //           <label className="block text-sm font-medium text-gray-700 mb-1">
              //             Points Allocation
              //           </label>
              //           <input
              //             type="number"
              //             name="pointsAllocation"
              //             value={points}
              //             onChange={(e) => setPoint(e.target.value)}
              //             className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              //             placeholder="Monthly points per user"
              //           />
              //         </div>
              //         <button
              //           type="button"
              //           className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              //         >
              //           Save Changes
              //         </button>
              //       </div>
              //     </div>
              //   </div>
              // </div>

              // <PaymentPage />
              <PointsDistForm />
            )}

            {currentView === "users" && <InviteMembers />}
          </div>
        </div>
      </div>
    </div>

    // <div className="min-h-screen bg-gray-50">
    // <div className="w-64 bg-[#0F0533] shadow-lg flex flex-col h-screen">
    //     <div className="p-4 flex-grow">
    //       <div className="flex items-center justify-center mb-6">
    //         <a
    //         href='/'>
    //         <img
    //           src="https://ucarecdn.com/89c130ef-6083-4ba2-a20d-ef5c56a5150c/-/format/auto/"
    //           alt="Company logo"
    //           className="h-12 w-auto"
    //         />
    //         </a>
    //       </div>
    //       <div className="flex flex-col space-y-2">
    //         <button
    //           onClick={() => setCurrentView("give")}
    //           className={`p-3 rounded-lg text-left ${
    //             currentView === "give"
    //               ? "bg-[#7F31FB] text-white"
    //               : "text-white hover:bg-[#7F31FB]/50"
    //           }`}
    //         >
    //           <i className="fas fa-gift mr-3"></i> Give Points
    //         </button>
    //         <button
    //           onClick={() => setCurrentView("company")}
    //           className={`p-3 rounded-lg text-left ${
    //             currentView === "company"
    //               ? "bg-[#7F31FB] text-white"
    //               : "text-white hover:bg-[#7F31FB]/50"
    //           }`}
    //         >
    //           <i className="fas fa-building mr-3"></i> Company Activity
    //         </button>
    //         <button
    //           onClick={() => setCurrentView("personal")}
    //           className={`p-3 rounded-lg text-left ${
    //             currentView === "personal"
    //               ? "bg-[#7F31FB] text-white"
    //               : "text-white hover:bg-[#7F31FB]/50"
    //           }`}
    //         >
    //           <i className="fas fa-user mr-3"></i> Your Activity
    //         </button>
    //         <button
    //           onClick={() => setCurrentView("rewards")}
    //           className={`p-3 rounded-lg text-left ${
    //             currentView === "rewards"
    //               ? "bg-[#7F31FB] text-white"
    //               : "text-white hover:bg-[#7F31FB]/50"
    //           }`}
    //         >
    //           <i className="fas fa-award mr-3"></i> Rewards
    //         </button>
    //         <button
    //           onClick={() => setCurrentView("transactions")}
    //           className="w-full bg-[#FC36FF] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#FC36FF]/80 transition-colors"
    //         >
    //           {points} Points Available
    //         </button>
    //       </div>
    //     </div>
    //     <div className="p-4 border-t border-[#7AFBF7]/20 mt-auto">
    //       {isAdmin && (
    //         <div className="space-y-2">
    //           <button
    //             onClick={() => setCurrentView("users")}
    //             className={`w-full p-3 rounded-lg text-left ${
    //               currentView === "users"
    //                 ? "bg-[#7F31FB] text-white"
    //                 : "text-white hover:bg-[#7F31FB]/50"
    //             }`}
    //           >
    //             <i className="fas fa-users mr-3"></i> Users
    //           </button>
    //           <button
    //             onClick={() => setCurrentView("settings")}
    //             className={`w-full p-3 rounded-lg text-left ${
    //               currentView === "settings"
    //                 ? "bg-[#7F31FB] text-white"
    //                 : "text-white hover:bg-[#7F31FB]/50"
    //             }`}
    //           >
    //             <i className="fas fa-cog mr-3"></i> Settings
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   </div>

    //   <div className="flex-1 flex justify-center p-8">
    //     <div className="w-full max-w-4xl">
    //       {currentView === "give" && (
    //         <>
    //           <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
    //             <div className="flex justify-between items-center mb-6">
    //               <h2 className="text-2xl font-semibold">Give Points</h2>
    //               <div className="bg-indigo-50 px-4 py-2 rounded-lg">
    //                 <span className="text-indigo-600 font-semibold">
    //                   {pointsToGive} points available to give
    //                 </span>
    //               </div>
    //             </div>
    //             <form onSubmit={handleSubmit} className="space-y-4">
    //               <div className="relative">
    //                 <div className="mb-4">
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Points to Give
    //                   </label>
    //                   <input
    //                     type="number"
    //                     value={pointsInput}
    //                     onChange={(e) => setPointsInput(e.target.value)}
    //                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                     placeholder="Enter points amount"
    //                     min="1"
    //                     max={pointsToGive}
    //                   />
    //                 </div>
    //                 <textarea
    //                   value={message}
    //                   onChange={handleMessageChange}
    //                   className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                   placeholder="@ someone and write your message"
    //                   rows={4}
    //                   name="message"
    //                 />
    //                 {showUserSuggestions && (
    //                   <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto">
    //                     {filteredUsers.map((user) => (
    //                       <button
    //                         key={user.id}
    //                         type="button"
    //                         onClick={() => handleUserSelect(user)}
    //                         className="w-full px-4 py-2 text-left hover:bg-gray-50"
    //                       >
    //                         <span className="font-medium">
    //                           {user.email.split("@")[0]}
    //                         </span>
    //                         <span className="text-gray-500">
    //                           {" "}
    //                           - {user.email}
    //                         </span>
    //                       </button>
    //                     ))}
    //                   </div>
    //                 )}
    //                 <div className="absolute bottom-2 right-2 flex space-x-2">
    //                   <button
    //                     type="button"
    //                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
    //                     className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
    //                   >
    //                     <i className="fas fa-smile"></i>
    //                   </button>
    //                 </div>
    //               </div>

    //               {showEmojiPicker && (
    //                 <div className="p-2 bg-white border rounded-lg shadow-lg">
    //                   <div className="grid grid-cols-6 gap-2">
    //                     {emojis.map((emoji, index) => (
    //                       <button
    //                         key={index}
    //                         type="button"
    //                         onClick={() => handleEmojiClick(emoji)}
    //                         className="text-2xl hover:bg-gray-100 p-2 rounded"
    //                       >
    //                         {emoji}
    //                       </button>
    //                     ))}
    //                   </div>
    //                 </div>
    //               )}

    //               <button
    //                 type="submit"
    //                 disabled={!selectedUser || !pointsInput || !message.trim()}
    //                 className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
    //               >
    //                 Give Points
    //               </button>
    //             </form>
    //           </div>

    //           <div className="bg-white p-6 rounded-xl shadow-sm">
    //             <h2 className="text-2xl font-semibold mb-6">Points Given</h2>
    //             <div className="space-y-4">
    //               {companyActivity
    //                 .filter((activity) => activity.from === "You")
    //                 .map((activity) => (
    //                   <div key={activity.id} className="border-b pb-4">
    //                     <div className="flex flex-col">
    //                       <div className="flex items-center gap-2 mb-2">
    //                         <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                           <p className="font-medium text-blue-600">
    //                             {activity.to}
    //                           </p>
    //                         </div>
    //                         <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
    //                           -{activity.points} points
    //                         </span>
    //                         <p className="text-xs text-gray-500">
    //                           {formatDate(activity.date)}
    //                         </p>
    //                         <div className="ml-auto flex gap-2">
    //                           <button
    //                             onClick={() => handleEditMessage(activity)}
    //                             className="text-indigo-600 hover:text-indigo-700"
    //                           >
    //                             <i className="fas fa-edit"></i>
    //                           </button>
    //                           <button
    //                             onClick={() => handleUndoPoints(activity)}
    //                             className="text-red-600 hover:text-red-700"
    //                             title="Undo points"
    //                           >
    //                             <i className="fas fa-undo"></i>
    //                           </button>
    //                         </div>
    //                       </div>
    //                       {editingActivity?.id === activity.id ? (
    //                         <div className="mt-2">
    //                           <textarea
    //                             value={editMessage}
    //                             onChange={(e) => setEditMessage(e.target.value)}
    //                             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                             rows={2}
    //                           />
    //                           <div className="flex justify-end gap-2 mt-2">
    //                             <button
    //                               onClick={handleCancelEdit}
    //                               className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
    //                             >
    //                               Cancel
    //                             </button>
    //                             <button
    //                               onClick={() => handleSaveEdit(activity.id)}
    //                               className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
    //                             >
    //                               Save
    //                             </button>
    //                           </div>
    //                         </div>
    //                       ) : (
    //                         <div className="bg-gray-50 rounded-lg p-3">
    //                           <p className="text-gray-600 break-words">
    //                             {activity.message}
    //                           </p>
    //                         </div>
    //                       )}
    //                     </div>
    //                   </div>
    //                 ))}
    //             </div>
    //           </div>
    //         </>
    //       )}

    //       {currentView === "personal" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">
    //             Your Points History
    //           </h2>
    //           <div className="space-y-4">
    //             {personalActivity.map((activity) => (
    //               <div key={activity.id} className="border-b pb-4">
    //                 <div className="flex flex-col">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                       <p className="font-medium text-blue-600">
    //                         {activity.from}
    //                       </p>
    //                     </div>
    //                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
    //                       +{activity.points} points
    //                     </span>
    //                     <p className="text-xs text-gray-500">
    //                       {formatDate(activity.date)}
    //                     </p>
    //                   </div>
    //                   <div className="bg-gray-50 rounded-lg p-3">
    //                     <p className="text-gray-600 break-words">
    //                       {activity.message}
    //                     </p>
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       )}

    //       {currentView === "company" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">Company Activity</h2>
    //           <div className="space-y-4">
    //             {companyActivity.map((activity) => (
    //               <div key={activity.id} className="border-b pb-4">
    //                 <div className="flex flex-col">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                       <p className="font-medium text-blue-600">
    //                         {activity.to}
    //                       </p>
    //                     </div>
    //                     <span className="text-gray-400">from</span>
    //                     <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                       <p className="font-medium text-blue-600">
    //                         {activity.from}
    //                       </p>
    //                     </div>
    //                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
    //                       +{activity.points} points
    //                     </span>
    //                     <p className="text-xs text-gray-500">
    //                       {formatDate(activity.date)}
    //                     </p>
    //                   </div>
    //                   <div className="bg-gray-50 rounded-lg p-3">
    //                     <p className="text-gray-600 break-words">
    //                       {activity.message}
    //                     </p>
    //                   </div>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       )}

    //       {currentView === "rewards" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">Rewards Catalog</h2>
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //             {rewards.map((reward) => (
    //               <div
    //                 key={reward.id}
    //                 className="border rounded-lg p-4 hover:shadow-md transition-shadow"
    //               >
    //                 <img
    //                   src={reward.image}
    //                   alt={reward.name}
    //                   className="w-full h-48 object-cover rounded-lg mb-4"
    //                 />
    //                 <h3 className="text-lg font-semibold">{reward.name}</h3>
    //                 <p className="text-gray-600 text-sm mb-3">
    //                   {reward.description}
    //                 </p>
    //                 <div className="flex justify-between items-center">
    //                   <span className="text-indigo-600 font-semibold">
    //                     {reward.points} points
    //                   </span>
    //                   <button
    //                     className={`px-4 py-2 rounded-lg ${
    //                       points >= reward.points
    //                         ? "bg-indigo-600 text-white hover:bg-indigo-700"
    //                         : "bg-gray-100 text-gray-400 cursor-not-allowed"
    //                     }`}
    //                     disabled={points < reward.points}
    //                   >
    //                     Redeem
    //                   </button>
    //                 </div>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //       )}

    //       {currentView === "transactions" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">
    //             Points Transactions
    //           </h2>
    //           <div className="space-y-4">
    //             {[...personalActivity, ...rewards.filter((r) => r.redeemed)]
    //               .sort((a, b) => new Date(b.date) - new Date(a.date))
    //               .map((activity) => (
    //                 <div key={activity.id} className="border-b pb-4">
    //                   <div className="flex flex-col">
    //                     <div className="flex items-center gap-2 mb-2">
    //                       {activity.name ? (
    //                         <>
    //                           <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                             <p className="font-medium text-blue-600">
    //                               Redeemed {activity.name}
    //                             </p>
    //                           </div>
    //                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
    //                             -{activity.points} points
    //                           </span>
    //                         </>
    //                       ) : (
    //                         <>
    //                           <span>Received from</span>
    //                           <div className="bg-blue-50 px-2 py-1 rounded-md">
    //                             <p className="font-medium text-blue-600">
    //                               {activity.from}
    //                             </p>
    //                           </div>
    //                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
    //                             +{activity.points} points
    //                           </span>
    //                         </>
    //                       )}
    //                       <p className="text-xs text-gray-500">
    //                         {formatDate(activity.date)}
    //                       </p>
    //                     </div>
    //                     {activity.message && (
    //                       <div className="bg-gray-50 rounded-lg p-3">
    //                         <p className="text-gray-600 break-words">
    //                           {activity.message}
    //                         </p>
    //                       </div>
    //                     )}
    //                   </div>
    //                 </div>
    //               ))}
    //           </div>
    //         </div>
    //       )}

    //       {currentView === "settings" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">Company Settings</h2>
    //           <div className="space-y-6">
    //             <div>
    //               <h3 className="text-lg font-semibold mb-4">
    //                 Company Information
    //               </h3>
    //               <div className="space-y-4">
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Company Name
    //                   </label>
    //                   <input
    //                     type="text"
    //                     name="companyName"
    //                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                     placeholder="Enter company name"
    //                   />
    //                 </div>
    //                 <div>
    //                   <label className="block text-sm font-medium text-gray-700 mb-1">
    //                     Points Allocation
    //                   </label>
    //                   <input
    //                     type="number"
    //                     name="pointsAllocation"
    //                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                     placeholder="Monthly points per user"
    //                   />
    //                 </div>
    //                 <button
    //                   type="button"
    //                   className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
    //                 >
    //                   Save Changes
    //                 </button>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}

    //       {currentView === "users" && (
    //         <div className="bg-white p-6 rounded-xl shadow-sm">
    //           <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
    //           <div className="space-y-6">
    //             <div>
    //               <h3 className="text-lg font-semibold mb-4">
    //                 Invite Team Members
    //               </h3>
    //               <form onSubmit={handleInviteSubmit} className="space-y-4">
    //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //                   <div>
    //                     <label
    //                       htmlFor="firstName"
    //                       className="block text-sm font-medium text-gray-700 mb-1"
    //                     >
    //                       First Name
    //                     </label>
    //                     <input
    //                       type="text"
    //                       id="firstName"
    //                       name="firstName"
    //                       value={inviteFirstName}
    //                       onChange={(e) => setInviteFirstName(e.target.value)}
    //                       className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                       placeholder="Enter first name"
    //                       required
    //                     />
    //                   </div>
    //                   <div>
    //                     <label
    //                       htmlFor="lastName"
    //                       className="block text-sm font-medium text-gray-700 mb-1"
    //                     >
    //                       Last Name
    //                     </label>
    //                     <input
    //                       type="text"
    //                       id="lastName"
    //                       name="lastName"
    //                       value={inviteLastName}
    //                       onChange={(e) => setInviteLastName(e.target.value)}
    //                       className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                       placeholder="Enter last name"
    //                       required
    //                     />
    //                   </div>
    //                 </div>
    //                 <div>
    //                   <label
    //                     htmlFor="email"
    //                     className="block text-sm font-medium text-gray-700 mb-1"
    //                   >
    //                     Email Address
    //                   </label>
    //                   <input
    //                     type="email"
    //                     id="email"
    //                     name="email"
    //                     value={inviteEmail}
    //                     onChange={(e) => setInviteEmail(e.target.value)}
    //                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                     placeholder="Enter email address"
    //                     required
    //                   />
    //                 </div>
    //                 <div>
    //                   <label
    //                     htmlFor="role"
    //                     className="block text-sm font-medium text-gray-700 mb-1"
    //                   >
    //                     Role
    //                   </label>
    //                   <select
    //                     id="role"
    //                     name="role"
    //                     value={inviteRole}
    //                     onChange={(e) => setInviteRole(e.target.value)}
    //                     className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    //                   >
    //                     <option value="member">Team Member</option>
    //                     <option value="admin">Admin</option>
    //                   </select>
    //                 </div>
    //                 <button
    //                   type="submit"
    //                   className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
    //                 >
    //                   Send Invitation
    //                 </button>
    //               </form>

    //               <div className="mt-6 p-4 border-t border-gray-200">
    //                 <h3 className="text-lg font-semibold mb-4">
    //                   Bulk Upload Users
    //                 </h3>
    //                 <p className="text-sm text-gray-600 mb-4">
    //                   Upload a CSV file with columns: email, firstName,
    //                   lastName, role (member/admin)
    //                 </p>
    //                 <div className="flex flex-col space-y-4">
    //                   <button
    //                     onClick={handleDownloadTemplate}
    //                     className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold flex items-center"
    //                   >
    //                     <i className="fas fa-download mr-2"></i>
    //                     Download CSV Template
    //                   </button>
    //                   <div className="flex items-center space-x-4">
    //                     <input
    //                       type="file"
    //                       accept=".csv"
    //                       onChange={(e) => setCsvFile(e.target.files?.[0])}
    //                       className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    //                     />
    //                     <button
    //                       onClick={handleCsvUpload}
    //                       disabled={!csvFile}
    //                       className={`px-4 py-2 rounded-lg ${
    //                         !csvFile
    //                           ? "bg-gray-100 text-gray-400 cursor-not-allowed"
    //                           : "bg-indigo-600 text-white hover:bg-indigo-700"
    //                       }`}
    //                     >
    //                       {false ? "Uploading..." : "Upload CSV"}
    //                     </button>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>

    //             <div className="mt-8">
    //               <h3 className="text-lg font-semibold mb-4">
    //                 Current Team Members
    //               </h3>
    //               <div className="overflow-x-auto">
    //                 <table className="min-w-full divide-y divide-gray-200">
    //                   <thead className="bg-gray-50">
    //                     <tr>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Name
    //                       </th>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Email
    //                       </th>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Role
    //                       </th>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Status
    //                       </th>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Date Invited
    //                       </th>
    //                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    //                         Actions
    //                       </th>
    //                     </tr>
    //                   </thead>
    //                   <tbody className="bg-white divide-y divide-gray-200">
    //                     {teamMembers.map((member) => (
    //                       <tr key={member.id}>
    //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //                           {member.firstName} {member.lastName}
    //                         </td>
    //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //                           {member.email}
    //                         </td>
    //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
    //                           {member.role}
    //                         </td>
    //                         <td className="px-6 py-4 whitespace-nowrap">
    //                           <span
    //                             className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
    //                               member.status === "active"
    //                                 ? "bg-green-100 text-green-800"
    //                                 : "bg-yellow-100 text-yellow-800"
    //                             }`}
    //                           >
    //                             {member.status === "active"
    //                               ? "Active"
    //                               : "Invite Sent"}
    //                           </span>
    //                         </td>
    //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //                           {formatDate(member.dateInvited)}
    //                         </td>
    //                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    //                           <button
    //                             onClick={() => handleDeleteMember(member.id)}
    //                             className="text-red-600 hover:text-red-900"
    //                           >
    //                             <i className="fas fa-trash"></i>
    //                           </button>
    //                         </td>
    //                       </tr>
    //                     ))}
    //                   </tbody>
    //                 </table>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
}

export default MainApp;
