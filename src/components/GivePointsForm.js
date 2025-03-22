import React, { useEffect, useState } from "react";
import { MentionsInput, Mention } from "react-mentions";
import MentionInputStyling from "../components/MentionInputStyling";
import apiFunctions from "../global/GlobalFunction";
import { API_URL, BASE_URL } from "../global/Constant";
import Toast from "../Hooks/Toast";
import axios from "axios";

const GivePointsForm = ({ setRefreshData }) => {
  const [message, setMessage] = useState("");
  const [pointsInput, setPointsInput] = useState("");
  const [submittedData, setSubmittedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // For real-time filtering

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const request = axios.CancelToken.source();
    getCompanyUsers(request);
    return () => request.cancel();
  }, []);

  const getCompanyUsers = async (request) => {
    if (loading) return;
    try {
      setLoading(true);
      const getCompanyUsersResponse = await apiFunctions.GET_REQUEST(
        BASE_URL + API_URL.GET_COMPANY_USERS,
        request
      );
      if (getCompanyUsersResponse.status === 200) {
        const apiUsers = getCompanyUsersResponse.data.users.map((user) => ({
          id: user._id,
          display: user.displayName, // Ensure 'display' key exists
        }));
        setUsers(apiUsers); // Update state with API data
        setFilteredUsers(apiUsers); // Initially, all users are displayed

        setLoading(false);
      } else {
        if (axios.isCancel(getCompanyUsersResponse)) {
          console.log("api is cancelled");
        } else {
          const successToast = new Toast(
            getCompanyUsersResponse.response.data.message,
            "error",
            getCompanyUsersResponse.response.status
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

  const handleSearch = (searchText) => {
    const filtered = users.filter((user) =>
      user.display.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // old function
  // const extractMentions = (message) => {
  //   let extractedUsers = [];
  //   let usedMentions = new Set();

  //   // Match mentions followed by a note (if any)
  //   const regex = /@\[([^\]]+)\]\(([^)]+)\)\s*([^\n@]*)/g;
  //   let match;
  //   while ((match = regex.exec(message)) !== null) {
  //     const displayName = match[1];
  //     const userId = match[2];
  //     const note = match[3]?.trim() || "No note provided"; // Capture text after mention

  //     if (!usedMentions.has(userId)) {
  //       extractedUsers.push({
  //         id: userId,
  //         // name: displayName,
  //         note: note,
  //         points: parseInt(pointsInput),
  //       });
  //       usedMentions.add(userId);
  //     }
  //   }

  //   return extractedUsers;
  // };

  const extractMentions = (message) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;

    let matches = [];
    let match;

    // Step 1: Extract all mentions
    while ((match = mentionRegex.exec(message)) !== null) {
      matches.push({
        display: match[1],
        id: match[2],
        start: match.index,
        end: mentionRegex.lastIndex,
      });
    }

    let extractedUsers = [];
    let usedMentions = new Set();

    // Step 2: Extract notes for each mention
    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const next = matches[i + 1];

      const noteStart = current.end;
      const noteEnd = next ? next.start : message.length;

      let rawNote = message.slice(noteStart, noteEnd).trim();

      matches[i].note = rawNote; // Temporarily store note
    }

    // Step 3: If the last one has a note, propagate it backward to those without
    let lastNote = matches[matches.length - 1].note || "No note provided";

    for (let i = matches.length - 1; i >= 0; i--) {
      let note = matches[i].note.trim();
      if (!note) {
        matches[i].note = lastNote;
      } else {
        lastNote = matches[i].note;
      }
    }

    // Step 4: Format result
    for (let i = 0; i < matches.length; i++) {
      const mention = matches[i];

      if (!usedMentions.has(mention.id)) {
        extractedUsers.push({
          id: mention.id,
          note: mention.note || "No note provided",
          points: parseInt(pointsInput),
        });
        usedMentions.add(mention.id);
      }
    }

    return extractedUsers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable button
    const mentionedUsers = extractMentions(message);

    if (mentionedUsers.length === 0) {
      alert("No valid mentions found.");
      return;
    }

    const submittedInfo = {
      users: mentionedUsers,
    };

    setSubmittedData(submittedInfo);
    // console.log("Submitted Data:", submittedInfo);

    try {
      let userTransactionResponse = await apiFunctions.POST_REQUEST(
        BASE_URL + API_URL.USER_TO_USER_TRANSACTION,
        submittedInfo
      );
      if (
        userTransactionResponse.status === 201 ||
        userTransactionResponse.status === 200
      ) {
        const successToast = new Toast(
          userTransactionResponse.data.message,
          "success",
          userTransactionResponse.status
        );
        successToast.show();

        // Clear form fields after successful submission
        setPointsInput("");
        setMessage("");
        setRefreshData((prev) => !prev);
      } else {
        const successToast = new Toast(
          userTransactionResponse.response.data.message,
          "error",
          userTransactionResponse.response.status
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

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
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
            />
          </div>
          <MentionsInput
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            style={MentionInputStyling}
            placeholder="@ someone and write your message"
          >
            <Mention
              trigger="@"
              data={users}
              // markup="@__display__"
              markup="@[__display__](__id__)"
              displayTransform={(id, display) => `@${display}`}
              onSearch={handleSearch} // Enable search filtering
              style={{}}
            />
          </MentionsInput>
        </div>

        <button
          type="submit"
          disabled={!message.trim() || !pointsInput || isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Give Points"}
        </button>
      </form>

      {/* {submittedData && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold">Submitted Data</h3>
          <pre className="bg-gray-200 p-2 rounded-lg text-sm">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )} */}
    </div>
  );
};

export default GivePointsForm;
