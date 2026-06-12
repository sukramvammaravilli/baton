"use strict";
/* =========================================
   API ENDPOINTS
========================================= */
const API = {
  profile: "/api/dashboard/profile",
  updateProfile: "/api/dashboard/updateProfile",
  accounts: "/api/accounts",
  addAccount: "/api/dashboard/addAccount",
  removeAccount: "/api/dashboard/removeAccount",
  dashboard: "/api/dashboard",
  deposit: "/api/dashboard/deposit",
  transfer: "/api/dashboard/transfer",
  transactions: "/api/dashboard/transactions",
  currencies: "/api/dashboard/getCurrencies",
  exchange: "/api/dashboard/exchange",
  reverseTransaction: "/api/dashboard/reverseTransaction",
  logout: "/api/logout",
};
/* =========================================
   GLOBAL DATA
========================================= */
let profileData = {};
let accountData = [];
let currencyData = [];
let ratesLoaded = false;

async function toggleRates() {
  const panel = $("exchangeRatesPanel");
  if (panel.style.display === "none") {
    panel.style.display = "block";
    if (!ratesLoaded) {
      await loadRatesTable();
      ratesLoaded = true;
    }
  } else {
    panel.style.display = "none";
  }
}

/* =========================================
   HELPERS
========================================= */
function hasAccounts() {
  return accountData && accountData.length > 0;
}

function $(id) {
  return document.getElementById(id);
}

function showMessage(message) {
  alert(message);
}

function showLoader() {
  const loader = $("loader");
  if (loader) {
    loader.style.display = "flex";
  }
}

function hideLoader() {
  const loader = $("loader");
  if (loader) {
    loader.style.display = "none";
  }
}

async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");
  options.headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, options);
  if (response.status === 401) {
    localStorage.clear();
    alert("Session Expired. Please login again.");
    window.location.href = "/index.html";
    return null;
  }
  return response;
}

async function loadRatesTable() {
  try {
    const data = currencyData;
    const tbody = $("ratesTableBody");
    tbody.innerHTML = "";
    data.forEach((rate) => {
      tbody.innerHTML += `
                <tr>
                    <td>
                        ${rate.currency_symbol}
                    </td>
                    <td>
                        ${rate.currency_name}
                    </td>
                    <td>
                    ${rate.currency_code}
                    </td>
                    <td>
                        ${rate.exchange_rate}
                    </td>
                </tr>
            `;
    });
  } catch (error) {
    showMessage(error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function openAccountModal() {
  $("accountModal").style.display = "flex";
}

function closeAccountModal() {
  $("accountModal").style.display = "none";
}

function renderAccounts() {
  const container = $("accountList");
  container.innerHTML = "";
  if (accountData.length === 0) {
    container.innerHTML = `
            <div class="account-item">
                <div class="account-info">
                    <div class="account-icon">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <div>
                        <h4>
                            No Accounts
                        </h4>
                        <span>
                            Create your first account
                        </span>
                    </div>
                </div>
            </div>
        `;
    return;
  }
  accountData.forEach((account) => {
    container.innerHTML += `
            <div class="account-item">
                <div class="account-info">
                    <div class="account-icon">
                        <i class="fa-solid fa-wallet"></i>
                    </div>
                    <div>
                        <h4>
                            ${account.account_no}
                        </h4>
                    </div>
                </div>
                <button
                    class="remove-btn"
                    onclick="removeAccount('${account.account_no}')">
                    <i class="fa-solid fa-trash"></i>
                    Remove
                </button>
            </div>
        `;
  });
}
/* =========================================
   SECTION NAVIGATION
========================================= */
function showSection(sectionId, element) {
  if (sectionId === "dashboardSection") {
    loadAccounts();
  }
  if (sectionId === "transactionSection") {
    const accountNo = $("transactionAccount")?.value;
    if (accountNo) {
      loadTransactions(accountNo);
    }
  }
  if (!hasAccounts() && sectionId !== "profileSection") {
    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.remove("active");
    });
    document.getElementById("dashboardSection").classList.add("active");
    document.querySelectorAll(".sidebar-menu li").forEach((item) => {
      item.classList.remove("active");
    });
    if (element) {
      element.classList.add("active");
    }
    return;
  }
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });
  document.getElementById(sectionId).classList.add("active");
  document.querySelectorAll(".sidebar-menu li").forEach((item) => {
    item.classList.remove("active");
  });
  if (element) {
    element.classList.add("active");
  }
}
/* =========================================
   PROFILE
========================================= */
async function loadProfile() {
  try {
    const response = await apiFetch(API.profile);
    profileData = await response.json();
    $("profileUsername").innerText = (
      profileData.username || "-"
    ).toUpperCase();
    $("profileName").innerText = (profileData.fullname || "-").toUpperCase();
    $("profileEmail").innerText = (profileData.email || "-").toUpperCase();
    $("profilePhone").innerText =
      `${profileData.country_code || ""} ${profileData.mobile_number || ""}`.toUpperCase();
    $("profileCurrency").innerText = (
      profileData.currency_code || "-"
    ).toUpperCase();
    $("profileIdentity").innerText = (
      profileData.identity_number || "-"
    ).toUpperCase();
  } catch (error) {
    showMessage(error);
  }
}
/* =========================================
   ACCOUNTS
========================================= */
async function loadAccounts() {
  try {
    const response = await apiFetch(API.dashboard);
    accountData = await response.json();
    populateAccountDropdowns();
    if (accountData.length) {
      loadDashboardSummary(accountData[0].account_no);
    }
    if (accountData.length) {
      document.getElementById("noAccountMessage").style.display = "none";
      document.getElementById("dashboardContent").style.display = "block";
    } else {
      document.getElementById("noAccountMessage").style.display = "block";
      document.getElementById("dashboardContent").style.display = "none";
    }
  } catch (error) {
    showMessage(error);
  }
}

function populateAccountDropdowns() {
  const dropdownIds = [
    "accountDropdown",
    "depositAccount",
    "transferFromAccount",
    "transactionAccount",
    "profileAccountDropdown",
  ];
  renderAccounts();
  dropdownIds.forEach((id) => {
    const dropdown = $(id);
    if (!dropdown) {
      return;
    }
    dropdown.innerHTML = "";
    accountData.forEach((account) => {
      dropdown.innerHTML += `
                <option
                    value="${account.account_no}">
                     ${account.account_no}
                </option>
            `;
    });
  });
}
/* =========================================
   DASHBOARD SUMMARY
========================================= */
async function loadDashboardSummary(accountNo) {
  try {
    const response = await apiFetch(API.dashboard);
    const data = await response.json();
    let details = data.find((ele) => ele.account_no === accountNo);
    const currency_detail = currencyData.find(
      (ele) => ele.currency_code === details.currency_code,
    );
    $("totalBalance").innerText =
      currency_detail.currency_symbol + " " + details.total_balance || 0;
    $("totalDeposit").innerText =
      currency_detail.currency_symbol + " " + details.total_deposit || 0;
    $("totalTransfer").innerText =
      currency_detail.currency_symbol + " " + details.total_transfer || 0;
  } catch (error) {
    showMessage(error);
  }
}
/* =========================================
   TRANSACTIONS
========================================= */

async function loadTransactions(accountNo) {
  try {
    const response = await apiFetch(
      `${API.transactions}?accountNo=${accountNo}`,
    );
    const data = await response.json();
    renderTransactions(data);
  } catch (error) {
    showMessage(error);
  }
}

async function reverseTransaction(transactionId, account_no) {
  const confirmReverse = confirm(
    "Are you sure you want to reverse this transaction?",
  );
  if (!confirmReverse) {
    return;
  }
  const response = await apiFetch(API.reverseTransaction, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transactionId
    }),
  });
  if (response.ok) {
    showMessage("Transaction Reversed");
    loadTransactions(account_no);
    loadDashboardSummary(account_no);
  }
}

function renderTransactions(data) {
  const table = $("transactionTable");
  table.innerHTML = "";
  if (!data.length) {
    table.innerHTML = `
            <tr>
                <td colspan="6">
                    No Transactions Found
                </td>
            </tr>
        `;
    return;
  }
  data.forEach((item) => {
    table.innerHTML += `
            <tr>
                <td>${item.transaction_id}</td>
                <td>${item.username}</td>
                <td>${item.type}</td>
                <td>${item.from_account}</td>
                <td>${item.to_account}</td>
                <td>${item.currency}</td>
                <td>${item.amount}</td>
                <td>${item.converted_amount}</td>
                <td>${item.status}</td>
                <td>
    ${formatDate(item.created_at)}
</td>
<td>
    ${
      item.type === "TRANSFER_OUT"
        ? item.is_reversed === 0
          ? `<button
        class="reverse-btn"
        onclick="
            reverseTransaction(
                '${item.transaction_id}','${item.from_account}'
            )">
        Reverse
    </button>`
          : `<span
        class="reversed-label">
        Reversed
    </span>`
        : "-"
    }
</td>
            </tr>
        `;
  });
}
/* =========================================
   CURRENCIES
========================================= */
async function loadCurrencies() {
  try {
    const response = await apiFetch(API.currencies);
    currencyData = await response.json();
    [
      "fromCurrency",
      "toCurrency",
      "depositCurrency",
      "transferCurrency",
    ].forEach((id) => {
      const dropdown = $(id);

      if (!dropdown) {
        return;
      }
      dropdown.innerHTML = "";
      currencyData.forEach((currency) => {
        dropdown.innerHTML += `
                    <option>
                        ${currency.currency_code}, ${currency.currency_symbol}
                    </option>
                `;
      });
    });
  } catch (error) {
    showMessage(error);
  }
}

async function addAccount() {
  const accountNo = $("newAccountNumber").value;
  const payload = {
    accountNo,
  };
  const response = await apiFetch(API.addAccount, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    showMessage("Account Added");
    closeAccountModal();
    loadAccounts();
  }
}

async function removeAccount(account) {
  const payload = {
    account,
  };

  const response = await apiFetch(API.removeAccount, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    showMessage("Account Removed");
    closeAccountModal();
    loadAccounts();
  }
}

$("updateProfileForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const payload = {
    fullname: $("updateFullName").value,
    email: $("updateEmail").value,
    mobile: $("updateMobile").value,
    identityNumber: $("updateIdentity").value,
  };

  const response = await apiFetch(API.updateProfile, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    showMessage("Profile Updated");
    await loadProfile();
  }
});
/* =========================================
   DEPOSIT
========================================= */
$("depositForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const payload = {
    accountNo: $("depositAccount").value,
    currency: $("depositCurrency").value,
    amount: $("depositAmount").value,
  };
  const response = await apiFetch(API.deposit, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    showMessage("Deposit Successful");
    loadAccounts();
  }
});
/* =========================================
   TRANSFER
========================================= */
$("transferForm")?.addEventListener("submit", async function (e) {
  e.preventDefault();
  const payload = {
    fromAccount: $("transferFromAccount").value,
    toAccount: $("receiverAccount").value,
    currency: $("transferCurrency").value,
    amount: $("transferAmount").value,
  };
  const response = await apiFetch(API.transfer, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    showMessage("Transfer Successful");
    loadAccounts();
  }
});
/* =========================================
   EXCHANGE
========================================= */
$("exchangeBtn")?.addEventListener("click", async function () {
  const payload = {
    from: $("fromCurrency").value,
    to: $("toCurrency").value,
    amount: $("exchangeAmount").value,
  };
  const response = await apiFetch(API.exchange, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  $("convertedAmount").value = result.convertedAmount;
});
/* =========================================
   DROPDOWN CHANGE EVENTS
========================================= */
$("accountDropdown")?.addEventListener("change", function () {
  loadDashboardSummary(this.value);
});

$("transactionAccount")?.addEventListener("change", function () {
  loadTransactions(this.value);
});
/* =========================================
   LOGOUT
========================================= */
$("logoutBtn")?.addEventListener("click", async function () {
  const confirmLogout = confirm("Are you sure you want to Logout?");
  if (!confirmLogout) {
    return;
  }
  const response = await apiFetch(API.logout);
  if (response.ok) {
    localStorage.clear();
    window.location.href = "/index.html";
  }
});
/* =========================================
   INITIAL LOAD
========================================= */
document.addEventListener("DOMContentLoaded", async function () {
  showLoader();
  try {
    await loadProfile();
    await loadCurrencies();
    await loadAccounts();
  } catch (error) {
    showMessage(error);
  } finally {
    hideLoader();
  }
});
