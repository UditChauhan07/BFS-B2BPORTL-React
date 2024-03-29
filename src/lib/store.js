export const originAPi = "https://b2b.beautyfashionsales.com"
// export const originAPi = "http://localhost:2000"
let url = `${originAPi}/beauty/`;
let URL = `${originAPi}/beauty/0DS68FOD7s`;
const orderKey = "orders";
const accountIdKey = "AccountId__c";
const brandIdKey = "ManufacturerId__c";
const brandKey = "Account";
const accountKey = "manufacturer";
const POCount = "woX5MkCSIOlHXkT";
const support = "AP0HBuNwbNnuhKR";
const shareKey = "R7Mmw2nG41y6MqI";
export const salesRepIdKey = "BzQIEAjzCEHmlXc";
export const admins = ["00530000005AdvsAAC","0053b00000DgEVEAA3"] //,"0053b00000CwOnLAAV" ,"0053b00000DgEVEAA3"
// export const originAPi = "https://dev.beautyfashionsales.com"

export function ShareDrive (data, remove = false){
  if(remove){
    localStorage.removeItem(shareKey);
    return true;
  }
  if(data){
    localStorage.setItem(shareKey, JSON.stringify(data))
    return true;
  }else{
    let strData = localStorage.getItem(shareKey);
    return JSON.parse(strData);
  }
}

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

  let orderCount = padNumber(count,true);
  if (beg?.orderList?.[0]?.productType === "pre-order") return `PRE-${AcCode + MaCode}${currentDate + currentMonth}${orderCount}`;
  else return `${AcCode + MaCode}${currentDate + currentMonth}${orderCount}`;
}

export function getStrCode(str) {
  if (!str) return null;
  let codeLength = str.split(" ");
  if (codeLength.length >= 2) {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[1].charAt(0).toUpperCase()}`;
  } else {
    return `${codeLength[0].charAt(0).toUpperCase() + codeLength[0].charAt(codeLength[0].length - 1).toUpperCase()}`;
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

export function formatNumber(num) {
  if (num >= 0 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }else if(num <0){
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num;
  }
}
export function supportDriveBeg() {
  let supportList = localStorage.getItem(support);
  return JSON.parse(supportList);
}
export async function supportShare(data) {
  localStorage.setItem(support, JSON.stringify(data));
  return true;
}
export function supportClear() {
  localStorage.removeItem(support);
  if (localStorage.getItem(support)) {
    return false;
  } else {
    return true;
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
      shippingMethod:null
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
      orderDetails.Account.shippingMethod = orderList[0].account.shippingMethod;
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
    localStorage.setItem(POCount, parseInt(+lastCount + 1));
    return data.order;
  } else if (data.status == 300) {
    DestoryAuth();
  } else {
    if(data?.data){
      return data.data
    }else{
      return false;
    }
  }
}

export async function DestoryAuth() {
  localStorage.clear();
  window.location.href = window.location.origin;
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
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}
export async function getOrderofSalesRep({ user, month }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", user.key);
  bodyContent.append("salesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/8QUZQtEILKLsFeE", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getTargetReportAll({ user, year, preOrder }) {
  if (user) {
    let headersList = {
      Accept: "*/*",
    };
    let tried = false;
    let bodyContent = new FormData();
    bodyContent.append("key", user.x_access_token);
    if(!admins.includes(user.Sales_Rep__c)){
      bodyContent.append("SalesRepId", user.Sales_Rep__c);
    }
    if (year) {
      bodyContent.append('year', year);
    }
    if (preOrder) {
      bodyContent.append('preorder', preOrder);
    }

    let response = await fetch(url + "target/4Tu6do95AxLM3Cl", {
      method: "POST",
      body: bodyContent,
      headers: headersList,
    });
    let data = JSON.parse(await response.text());
    if (data.status == 300) {
      DestoryAuth();
    } else {
      let rawRes = { ownerPermission: false, list: data.data }
      if(admins.includes(user.Sales_Rep__c)){
        rawRes.ownerPermission = true;
      }
      return rawRes;
    }
  } else {
    return false
  }
}
export async function getOrderDetailsBasedId({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "0DS68FOD7s", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getOrderDetailsInvoice({ rawData }) {
  let headersList = {
    Accept: "*/*",
  };

  let bodyContent = new FormData();
  bodyContent.append("key", rawData.key);
  bodyContent.append("opportunity_id", rawData.id);

  let response = await fetch(url + "3JlgPqaeYIveHd6", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return {data:data.data,attachment:data.attachedmenetdata};
  }
}

export async function getDashboardata({ user }) {
  let headersList = {};
  if (user.headers) {
    headersList = user.headers || {};
  } else {
    headersList = {
      Accept: "*/*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    };
  }

  let bodyContent = new FormData();
  bodyContent.append("key", user.x_access_token);
  bodyContent.append("SalesRepId", user.Sales_Rep__c);

  let response = await fetch(url + "v3/wFzNQ13Eu72zQfy", {
    // let response = await fetch(url + "v3/3kMMguJj62cyyf0", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getSupportList({ key,salesRepId }) {
  let headersList = {
    Accept: "*/*",
  };
  // console.log({user});
  let bodyContent = new FormData();
  bodyContent.append("key", key);
  bodyContent.append("salesRepId", salesRepId);

  let response = await fetch(url + "v3/TDIztRiHo6Juf3I", {
    method: "POST",
    body: bodyContent,
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
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
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
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
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getAllAccount({ user }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let body = {
    key: user.x_access_token,
    salesRepId: user.Sales_Rep__c,
  };
  let response = await fetch(url + "v3/fmJJCh9HaL33Iqp", {
    method: "POST",
    headers: headersList,
    body: JSON.stringify(body),
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth()
  } else {
    return data.data;
  }
}

export async function postSupport({ rawData }) {
  console.log({ rawData });
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/hunQaon7f5sTDeb", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportAny({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/OFT88qVeJPUGsly", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function postSupportComment({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/dgwz2CbCvN2QzAk", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductList({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "HSc6cv4", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getProductImage({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/4v8x5lE25F6VmIs", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.url;
  }
}

export async function getProductImageAll({ rawData }) {
  console.log({rawData});
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  // let response = await fetch(url + "v3/Ftr7xyLKqgFo5MO", {
  let response = await fetch(url + "v3/fGBDynHKNNfVNki", {
    
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data.data;
  }
}

export async function getProductDetails({ rawData }) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/V59WN1CMm8Pjxay", {
    method: "POST",
    body: JSON.stringify(rawData),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function topProduct({month,manufacturerId}) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/dC0mhTDnL9l0mK1", {
    method: "POST",
    body: JSON.stringify({month,manufacturerId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getBrandList({key,userId}) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
    key,userId
  };
  let response = await fetch(url + "v3/yRNGIO", {
    method: "POST",
    // body: JSON.stringify({key,userid:userId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getRetailerList({key,userId}) {
  let headersList = {
    Accept: "*/*",key,userId,
    "Content-Type": "application/json",
  };
  let response = await fetch(url + "v3/JbUxci", {
    method: "POST",
    // body: JSON.stringify({key,userid:userId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getSalesRepList({key}) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/1FnQ4K9DItMBZ1D", {
    method: "POST",
    body: JSON.stringify({key}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}

export async function getSessionStatus({key,salesRepId}) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };
  let response = await fetch(url + "v3/XbgheAKvG5EtkXs", {
    method: "POST",
    body: JSON.stringify({key,salesRepId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data;
  }
}
export async function getMarketingCalendar({key,manufacturerId}) {
  let headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  let response = await fetch(url + "v3/eVC3IaiEEz3x7ym", {
    method: "POST",
    body: JSON.stringify({key,manufacturerId}),
    headers: headersList,
  });
  let data = JSON.parse(await response.text());
  if (data.status == 300) {
    DestoryAuth();
  } else {
    return data?.data;
  }
}