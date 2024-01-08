let url = "https://dev.beautyfashionsales.com/beauty/";
let URL = "https://dev.beautyfashionsales.com/beauty/0DS68FOD7s";
const orderKey = "orders";
const accountIdKey = "AccountId__c";
const brandIdKey = "ManufacturerId__c";
const brandKey = "Account";
const accountKey = "manufacturer";
const POCount = "woX5MkCSIOlHXkT";
const support = "AP0HBuNwbNnuhKR";
export async function AuthCheck() {
  if (JSON.parse(localStorage.getItem("Api Data"))?.data) {
    return true;
  } else {
    DestoryAuth();
    return false;
  }
}

export function POGenerator() {
  let count = parseInt(localStorage.getItem(POCount)) || 1;
  if (count == "NaN") {
    localStorage.setItem(POCount, 1);
    count = 1;
  }
  let date = new Date();
  let currentMonth = padNumber(date.getMonth() + 1, true);
  let currentDate = padNumber(date.getDate(), true);
  let beg = fetchBeg();
  let AcCode = getStrCode(beg?.Account?.name);
  let MaCode = getStrCode(beg?.Manufacturer?.name);

  let orderCount = padNumber(count);
  return `${AcCode + MaCode}${currentDate + currentMonth}-${orderCount}`;
}

export function getStrCode(str) {
  if (!str) return null;
  let codeLength = str.split(" ");
  if (codeLength.length >= 2) {
    return `${
      codeLength[0].charAt(0).toUpperCase() +
      codeLength[1].charAt(0).toUpperCase()
    }`;
  } else {
    return `${
      codeLength[0].charAt(0).toUpperCase() +
      codeLength[0].charAt(codeLength[0].length - 1).toUpperCase()
    }`;
  }
}
function padNumber(n, isTwoDigit) {
  if (isTwoDigit) {
    if (n < 10) {
      return "0" + n;
    } else {
      return n;
    }
  } else {
    if (n < 10) {
      return "000" + n;
    } else if (n < 100) {
      return "00" + n;
    } else if (n < 1000) {
      return "0" + n;
    } else {
      return n;
    }
  }
}
export function supportDriveBeg(){
  let supportList = localStorage.getItem(support);
  return JSON.parse(supportList);
}
export async function supportShare(data){
  localStorage.setItem(support,JSON.stringify(data))
  return true
}
export function supportClear(){
  localStorage.removeItem(support)
  if(localStorage.getItem(support)){
    return true;
  }else{
    return false;
  }
}

export function fetchBeg() {
  let orderStr = localStorage.getItem(orderKey);
  let orderDetails = {
    orderList: [],
    Account: {
      name: null,
      id: null,
      address: null,
    },
    Manufacturer: {
      name: null,
      id: null,
    },
  };
  if (orderStr) {
    let orderList = Object.values(JSON.parse(orderStr));
    if (orderList.length > 0) {
      orderDetails.Account.id = orderList[0].account.id;
      orderDetails.Account.name = orderList[0].account.name;
      orderDetails.Account.address = JSON.parse(orderList[0].account.address);
      orderDetails.Manufacturer.id = orderList[0].manufacturer.id;
      orderDetails.Manufacturer.name = orderList[0].manufacturer.name;
      orderDetails.orderList = orderList;
    }
  }
  return orderDetails;
}

export async function OrderPlaced({ order }) {
  let orderinit = {
    info: order,
  };
  let headersList = {
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "4eIAaY2H", {
    method: "POST",
    body: JSON.stringify(orderinit),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 200) {
    localStorage.removeItem(orderKey);
    localStorage.removeItem(accountIdKey);
    localStorage.removeItem(brandIdKey);
    localStorage.removeItem(brandKey);
    localStorage.removeItem(accountKey);
    let lastCount = localStorage.getItem(POCount) || 1;
    localStorage.setItem(POCount, parseInt(lastCount + 1));
    return data.order;
  } else {
    return false;
  }
}

export async function DestoryAuth() {
  localStorage.clear();
  // window.localStorage.href = "/"
  return true;
}

export async function GetAuthData() {
  if (!AuthCheck) {
    DestoryAuth();
  } else {
    return JSON.parse(localStorage.getItem("Api Data"))?.data;
  }
}

export async function getOrderList({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("Sales_Rep__c", user.Sales_Rep__c);
  bodyContent.append("month", month === "last-6-months" ? "" : month);

  let response = await fetch(url + "v3/20h2J48c", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  return data.data;
}

export async function getDashboardata({ user }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.x_access_token);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/3kMMguJj62cyyf0", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  return data.data;
}

export async function getSupportList({ user }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.x_access_token);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/TDIztRiHo6Juf3I", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  return data.data;
}

export async function getSupportDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("caseId", rawData.caseId);

  let response = await fetch(url + "v3/ffBUF1vNs9LTLfz", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  return data.data;
}

export async function getSupportFormRaw({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("AccountId", rawData.AccountId);

  let response = await fetch(url + "v3/HX0RbhJ3jppDwQX", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  return data.data;
}

export async function postSupport({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json"
  };

  let response = await fetch(url + "v3/hunQaon7f5sTDeb", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({data});
  return data.data;
}

export async function postSupportComment({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json"
  };

  let response = await fetch(url + "v3/dgwz2CbCvN2QzAk", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  console.log({data});
  return data.data;
}
