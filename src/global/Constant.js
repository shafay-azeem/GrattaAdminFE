//export const BASE_URL = "http://localhost:7000/";
export const BASE_URL = "https://gratta-admin-be-2.vercel.app/";

export const API_URL = {
  // USERS
  SIGNUP: "api/user/V1/createUser",

  SIGNIN: "api/user/V1/login",

  UPDATE_PROFILE: "api/user/V1/updateProfile",

  INVITE_USER: "api/user/V1/inviteUser",

  BULK_INVITE: "api/user/V1/bulkInvite",

  GET_USERS_BY_COMPANY_ID: "api/user/V1/getUsersByCompany/",

  USER_DETAIL: "api/user/V1/userDetail",

  FOTGOT_PASSWORD: "api/user/V1/forgotPassword",

  RESET_PASSWORD: "api/user/V1/resetPassword/",

  ACCEPT_INVITATION: "api/user/V1/acceptInvitation/",

  DELETE_USER_BY_ID: "api/user/V1/deleteUserById/",

  GET_ACTIVE_USER_COUNT_BY_COMPANY_ID:
    "api/user/V1/getActiveUserCountByCompanyId",

  GET_USER_COMPANY_POINTS: "api/user/V1/getUserCompanyPoints",

  GET_COMPANY_USERS: "api/user/V1/getCompanyUsers",

  POINTS_DISTRIBUTE_BY_COMPANY_ID: "api/points/V1/pointsDistributeByCompany",

  USER_TO_USER_TRANSACTION: "api/points/V1/userToUserTransaction",

  GET_USER_POINT_HISTORY: "api/points/V1/getUserPointHistory",

  GET_RECEIVED_USER_TRANSFERS: "api/points/V1/getReceivedUserTransfers",

  GET_POINTS_GIVEN_LAST_HOUR: "api/points/V1/getPointsGivenLastHour",

  UPDATE_TRANSACTION_NOTE: "api/points/V1/updateTransactionNote",

  REVERT_TRANSACTION: "api/points/V1/revertTransaction",

  GET_COMPANY_TRANSACTIONS: "api/company/V1/getCompanyTransactions",

  POST_CHECKOUT: "/checkout/proceed-to-payment",
};
