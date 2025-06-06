// import React, { useEffect, useState, useMemo, startTransition, Suspense } from "react";
// import Styles from "./Dashboard.module.css";
// import img1 from "./Images/Active-1.png";
// import img2 from "./Images/Vector.png";
// import img3 from "./Images/Group.png";
// import img4 from "./Images/Group1.png";
// import { PieChart, Pie, Cell } from "recharts";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthCheck, GetAuthData, admins, defaultLoadTime, formatNumber, getDashboardata, hexabrand, refreshTargetRollOver } from "../../lib/store";
// import { getRandomColors } from "../../lib/color";
// import ContentLoader from "react-content-loader";
// import SelectBrandModel from "../My Retailers/SelectBrandModel/SelectBrandModel";
// import ModalPage from "../Modal UI/index";
// import AppLayout from "../AppLayout";
// import { FilterItem } from "../FilterItem";
// import { UserIcon } from "../../lib/svg";
// import { BiRefresh } from "react-icons/bi";
// import { getPermissions } from "../../lib/permission";
// import { salesRepIdKey } from "../../lib/store";
// import { useSearchParams } from "react-router-dom";
// import dataStore from "../../lib/dataStore";
// import useBackgroundUpdater from "../../utilities/Hooks/useBackgroundUpdater";
// const GraphHandler = React.lazy(() => import("./GraphHandler"));
// const Chart = React.lazy(() => import("react-apexcharts"));
// const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// function Dashboard() {

//   const bgColors = {
//     "Kevyn Aucoin Cosmetics": "KevynAucoinCosmeticsBg",
//     "Bumble and Bumble": "BumbleandBumbleBg",
//     "BY TERRY": "BYTERRYBg",
//     "Bobbi Brown": "BobbiBrownBg",
//     ReVive: "ReViveBg",
//     "Maison Margiela": "MaisonMargielaBg",
//     Smashbox: "SmashboxBg",
//     "RMS Beauty": "RMSBeautyBg",
//     "ESTEE LAUDER": "esteeLauderBg",
//   };
//   const [dataa, setDataa] = useState({
//     options: {
//       chart: {
//         type: "area",
//       },
//       stroke: {
//         curve: "smooth",
//         width: 2,
//       },

//       dataLabels: {
//         enabled: true,
//       },
//       colors: getRandomColors(17),
//       fill: {
//         type: "gradient",
//         gradient: {
//           opacityFrom: 0,
//           opacityTo: 0,
//         },
//       },

//       xaxis: {
//         categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//       },
//       yaxis: {
//         title: {
//           text: "$ (Dollar)",
//         },
//       },

//       tooltip: {
//         y: {
//           formatter: function (val) {
//             return "$" + Number(val).toFixed(2) + "";
//           },
//         },
//       },
//     },
//   });
//   const currentMonth = new Date().getMonth() + 1;
//   const currentYear = new Date().getFullYear();
//   const [selMonth, setSelMonth] = useState(`${currentYear}|${currentMonth}`);
//   const [isLoading, setIsLoading] = useState(false);
//   const [brandData, setBrandData] = useState([]);
//   const navigate = useNavigate();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [targetValue, setTargetValue] = useState();
//   const [achievedSales, setAchievedSales] = useState();
//   const [needle_data, setNeedle_data] = useState([]);
//   const [selectYear, setYear] = useState();
//   const [selectMonth, setMonth] = useState();
//   const [permissions, setPermissions] = useState(null);

//   //dashboard varibale used
//   const [box, setBox] = useState({ RETAILERS: 0, GROWTH: 0, ORDERS: 0, REVENUE: 0, TARGET: 0 })
//   const [Monthlydataa, setMonthlydata] = useState({ isLoaded: false, data: [] });
//   const [Yearlydataa, setYearlydata] = useState({ isLoaded: false, data: [] });
//   const [accountPerformance, setAccountPerformance] = useState({ isLoaded: false, data: [] });
//   const [leadsbybrand, setleadsbtbrand] = useState({ isLoaded: false, data: [] });
//   const monthList = useMemo(() => {
//     const months = [];
//     for (let month = 1; month <= 12; month++) {
//       const monthName = new Date(currentYear, month - 1)
//         .toLocaleString('default', { month: 'long' })
//         .slice(0, 3); // Get the first 3 letters of the month name
//       months.push({
//         name: `${monthName} - ${currentYear}`,
//         value: `${currentYear}|${month}`,
//       });
//     }
//     return months;
//   }, [currentYear]);
//   const [salesByBrandData, setSalesByBrandData] = useState({

//     series: [],
//     options: {
//       chart: {
//         type: "donut",
//       },
//       labels: {
//         show: true,
//         name: {
//           show: true,
//           offsetY: 38,
//           formatter: () => "out of 553 points",
//         },
//       },
//       plotOptions: {
//         pie: {
//           donut: {
//             labels: {
//               show: true,
//               total: {
//                 show: true,
//                 showAlways: true,
//                 formatter: function (w) {
//                   const t = w.globals.seriesTotals;
//                   const result = t.reduce((a, b) => a + b, 0);
//                   // return (result / 10000).toFixed(1);
//                   return result;
//                 },
//               },
//             },
//           },
//         },
//       },

//       responsive: [
//         {
//           breakpoint: 480,
//           options: {
//             chart: {
//               width: "100px",
//             },
//           },
//         },
//       ],
//       colors: getRandomColors(8),
//       labels: [],
//     },
//   });
//   const [selectedSalesRepId, setSelectedSalesRepId] = useState(null);
//   // navigation of manufacturer to product page 
//   const handleBrandClick = (brand) => {

//     setModalOpen(true);
//     setBrandData(brand.ManufacturerList);
//     localStorage.setItem("Account", brand.Name);
//     localStorage.setItem("AccountId__c", brand.AccountId);
//     localStorage.setItem("address", JSON.stringify(brand.Address));
//   };

//   const handleManufacturerSelect = (selectedBrand) => {
//     GetAuthData()
//       .then((user) => {
//         setSelectedSalesRepId(user.Sales_Rep__c);
//       })
//     localStorage.setItem("manufacturer", selectedBrand.ManufacturerName__c || selectedBrand.Name);
//     localStorage.setItem("ManufacturerId__c", selectedBrand.ManufacturerId__c || selectedBrand.Id);
//     localStorage.setItem(salesRepIdKey, salesRepId);
//     localStorage.setItem("shippingMethod", JSON.stringify({
//       number: selectedBrand.Shipping_Account_Number__c,
//       method: selectedBrand.Shipping_Method__c,
//     }));

//     navigate(`/product`);
//   };
//   const [manufacturerSalesYear, setManufacturerSalesYaer] = useState([]);
//   const [salesRepAdmin, setSalesRepAdmin] = useState();
//   function generateUniqueLightColor(value) {
//     // Function to generate a random light color (RGB values between 128 and 255)
//     const generateRandomLightHexColor = () => {
//       const getRandomLightValue = () => Math.floor(Math.random() * 128) + 128; // Random value between 128 and 255

//       const r = getRandomLightValue();
//       const g = getRandomLightValue();
//       const b = getRandomLightValue();

//       // Convert RGB to hex and return it as a string
//       return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
//     };

//     // Check if a color is already in use for the given value
//     const isColorUnique = (color) => {
//       return !hexabrand[value] || !hexabrand[value].includes(color);
//     };

//     let newColor = generateRandomLightHexColor();

//     // Ensure the color is unique by checking the existing colors in hexabrand[value]
//     while (!isColorUnique(newColor)) {
//       newColor = generateRandomLightHexColor();
//     }

//     return newColor;
//   }

//   // API INTEGRATION
//   // search params work 
//   const [searchParams] = useSearchParams();
//   const saleRepId = searchParams.get('saleRep')
//   // 
//   const readyDashboardHandle = (dashboard) => {
//     GetAuthData()
//       .then((user) => {
//         let oldSalesAmount = dashboard?.oldSalesAmount || 0;
//         let currentSalesAmount = dashboard.monthlySalesRepData?.[user.Sales_Rep__c]?.sale || 0
//         let growth = parseInt(((currentSalesAmount - oldSalesAmount) / oldSalesAmount) * 100)
//         setBox({ RETAILERS: dashboard?.activeAccount || 0, GROWTH: growth || 0, ORDERS: dashboard?.totalOrder || 0, REVENUE: dashboard?.totalPrice || 0, TARGET: dashboard.salesRepTarget || 0 })
//         let tempValue = (dashboard?.totalPrice / dashboard.salesRepTarget * 100) <= 100 ? dashboard?.totalPrice / dashboard.salesRepTarget * 100 : 100;
//         setValue(tempValue)
//         setNeedle_data([
//           { name: "A", value: parseInt(tempValue), color: "#16BC4E" },
//           { name: "B", value: parseInt(tempValue > 0 ? 100 - tempValue : 100), color: "#C7C7C7" },
//         ])
//         setTargetValue(Number(dashboard.salesRepTarget));
//         setAchievedSales(Number(dashboard?.totalPrice));
//         setIsLoading(true)
//         if (dashboard.rawPerformance?.length) {
//           setAccountPerformance({ isLoaded: true, data: dashboard?.rawPerformance || [] })
//         } else {
//           setAccountPerformance({ isLoaded: true, data: [] })
//         }
//         if (dashboard?.monthlySalesRepData) {
//           let monthlyDataKey = Object.keys(dashboard?.monthlySalesRepData)
//           let temp = [];
//           monthlyDataKey.map((id) => {
//             temp.push(dashboard.monthlySalesRepData[id])
//           })
//           setMonthlydata({ isLoaded: true, data: temp })
//         }
//         if (dashboard.yearlySalesRepData) {
//           let monthlyDataKey = Object.keys(dashboard?.yearlySalesRepData)
//           let temp = [];
//           monthlyDataKey.map((id) => {
//             temp.push(dashboard.yearlySalesRepData[id])
//           })
//           setYearlydata({ isLoaded: true, data: temp })
//         }
//         if (dashboard?.monthlyManufactureData) {
//           let monthlyDataKey = Object.keys(dashboard?.monthlyManufactureData)
//           let temp = [];
//           monthlyDataKey.map((id) => {
//             temp.push(dashboard.monthlyManufactureData[id])
//           })
//           setBrandData({ isLoaded: true, data: temp })
//         }
//         //ownManuFactureData
//         if (dashboard?.monthlyManufactureData) {
//           let colorArray = [];
//           Object.values(dashboard?.monthlyManufactureData).map((value) => {
//             colorArray.push(hexabrand[value.id]||"#ED8A61");
//           })
//           setDataa({
//             options: {
//               chart: {
//                 type: "area",
//               },
//               stroke: {
//                 curve: "smooth",
//                 width: 2,
//               },

//               dataLabels: {
//                 enabled: true,
//               },
//               colors: colorArray,
//               fill: {
//                 type: "gradient",
//                 gradient: {
//                   opacityFrom: 0,
//                   opacityTo: 0,
//                 },
//               },

//               xaxis: {
//                 categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//               },
//               yaxis: {
//                 title: {
//                   text: "$ (Dollar)",
//                 },
//               },

//               tooltip: {
//                 y: {
//                   formatter: function (val) {
//                     return "$" + Number(val).toFixed(2) + "";
//                   },
//                 },
//               },
//             },
//           })
//           setSalesByBrandData({
//             series: Object.values(dashboard?.monthlyManufactureData).map((value) => {
//               return value?.own || 0;
//             }),
//             options: {
//               chart: {
//                 type: "donut",
//               },
//               labels: {
//                 show: true,
//                 name: {
//                   show: true,
//                   offsetY: 38,
//                   formatter: () => "out of 553 points",
//                 },
//               },
//               plotOptions: {
//                 pie: {
//                   donut: {
//                     labels: {
//                       show: true,

//                       total: {
//                         show: true,
//                         showAlways: true,
//                         label: "Total Orders",
//                         formatter: function (w) {
//                           const t = w.globals.seriesTotals;
//                           const result = t.reduce((a, b) => a + b, 0);
//                           return result;
//                           // return result < 1000 ? result.toFixed(1) : `${(result / 1000).toFixed(1)}K`;
//                         },
//                       },
//                     },
//                   },
//                 },
//               },

//               responsive: [
//                 {
//                   breakpoint: 100,
//                   options: {
//                     chart: {
//                       width: "100px",
//                     },
//                   },
//                 },
//               ],
//               colors: colorArray,

//               labels: Object.values(dashboard?.monthlyManufactureData).map((value) => {
//                 return value?.brandName || 0;
//               }),
//             },
//           });
//         }
//         if (dashboard?.yearlyManufacturerData) {
//           let monthlyDataKey = Object.keys(dashboard.yearlyManufacturerData)
//           let temp = [];
//           monthlyDataKey.map((id) => {
//             let indexValue = dashboard.yearlyManufacturerData[id];
//             let raw = {
//               name: indexValue.name,
//               data: []
//             }
//             monthNames.map((month, index) => {
//               raw.data.push(parseFloat(indexValue[month].sale).toFixed(2))
//             })
//             temp.push(raw)
//           })
//           setManufacturerSalesYaer(temp)
//         }
//         if (dashboard?.leadManufacturerRaw) {
//           let monthlyDataKey = Object.keys(dashboard?.leadManufacturerRaw)
//           let temp = [];
//           monthlyDataKey.map((id) => {
//             temp.push(dashboard.leadManufacturerRaw[id])
//           })
//           setleadsbtbrand({ isLoaded: true, data: temp })
//         }
//       })
//       .catch((error) => {
//         console.error({ error });
//       });
//   }
//   const getDataHandler = (headers = null) => {
//     // setIsLoaded(true);
//     GetAuthData()
//       .then((user) => {
//         setSalesRepId(user.Sales_Rep__c);
//         if (headers) {
//           user.headers = headers;
//         }
//         if (memoizedPermissions?.modules?.godLevel) {
//           setSalesRepAdmin(true)
//         }
//         dataStore.getPageData("/dashboard" + headers.month ?? currentMonth + headers.year ?? currentYear, () => getDashboardata({ user, saleRepId }))
//           .then((dashboard) => {
//             readyDashboardHandle(dashboard)
//           })
//           .catch((err) => {
//             console.error({ err });
//           });
//       })
//       .catch((error) => {
//         console.error({ error });
//       });
//   };
//   useEffect(() => {
//     if (localStorage.getItem("Name")) {
//       dataStore.subscribe("/dashboard" + currentMonth + currentYear, readyDashboardHandle);
//       // getDataHandler();
//       setYear(currentYear)
//       setMonth(currentMonth)
//       getDataHandler({ month: currentMonth, year: currentYear });
//       return () => {
//         dataStore.unsubscribe("/dashboard" + currentMonth + currentYear, readyDashboardHandle);
//       }
//     } else {
//       navigate("/");
//     }
//   }, []);

//   useEffect(() => {
//     if (!AuthCheck()) {
//       navigate("/");
//     }
//   }, []);
//   const [salesRepId, setSalesRepId] = useState();

//   let lowPerformanceArray = accountPerformance?.data?.slice(0)?.reverse()?.map((ele) => ele);

//   useBackgroundUpdater(() => getDataHandler({ month: selectMonth, year: selectYear }), defaultLoadTime);
//   const changeMonthHandler = (value) => {
//     setIsLoading(false);
//     setleadsbtbrand({ isLoaded: false, data: [] })
//     setAccountPerformance({ isLoaded: false, data: [] })
//     setMonthlydata({ isLoaded: false, data: [] })
//     setYearlydata({ isLoaded: false, data: [] })
//     setBrandData({ isLoaded: false, data: [] })
//     setManufacturerSalesYaer([]);
//     setBox({ RETAILERS: 0, GROWTH: 0, ORDERS: 0, REVENUE: 0, TARGET: 0 })
//     setSelMonth(value);
//     const valuePlit = value.split("|");
//     let month = valuePlit[1] || null;
//     let year = valuePlit[0] || null;
//     setYear(year)
//     setMonth(month)
//     getDataHandler({ month, year });
//   };
//   const RADIAN = Math.PI / 180;
//   const cx = 150;
//   const cy = 200;
//   const iR = 50;
//   const oR = 100;
//   const [value, setValue] = useState((box.REVENUE / box.TARGET * 100) <= 100 ? box.REVENUE / box.TARGET * 100 : 100)
//   const needle = (value, data, cx, cy, iR, oR, color) => {
//     let ang = 180 - ((value / 100) * 180);
//     if (value == 0) {
//       ang = 180;
//     }
//     const length = (iR + 2.4 * oR) / 3;
//     const sin = Math.sin(-RADIAN * ang);
//     const cos = Math.cos(-RADIAN * ang);
//     const r = 5;
//     const x0 = cx + 5;
//     const y0 = cy + 5;
//     const xba = x0 + r * sin;
//     const yba = y0 - r * cos;
//     const xbb = x0 - r * sin;
//     const ybb = y0 + r * cos;
//     const xp = x0 + length * cos;
//     const yp = y0 + length * sin;
//     return [<circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />, <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />];
//   };
//   useEffect(() => {
//     async function fetchPermissions() {
//       try {
//         const userPermissions = await getPermissions(); // Fetch permissions
//         setPermissions(userPermissions); // Set permissions in state
//       } catch (err) {
//         console.error("Error fetching permissions", err);
//       }
//     }

//     fetchPermissions(); // Fetch permissions on mount
//   }, []);

//   const memoizedPermissions = useMemo(() => permissions, [permissions]);

//   function IsTableLoading() {
//     return (
//       <>
//         <tr>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//           <td>
//             <ContentLoader />
//           </td>
//         </tr>
//       </>
//     );
//   }
//   let totalTargetForMTDSalesRep = 0;
//   let totalAmountForMTDSalesRep = 0;
//   let totalDiffForMTDSalesRep = 0;
//   let totalTargetForYTDSalesRep = 0;
//   let totalAmountForYTDSalesRep = 0;
//   let totalDiffForYTDSalesRep = 0;
//   let totalTargetForMTDGoalBrand = 0;
//   let totalAmountForMTDGoalBrand = 0;
//   let totalDiffForMTDGoalBrand = 0;
//   let totalRecieved = 0;
//   let totalConverted = 0;
//   const sendDataTargetHandler = ({ salesRepId = null, manufacturerId = null }) => {
//     console.log({salesRepId})
//     navigate('/Target-Report', { state: { salesRepId, manufacturerId } });
//   }
//   const targeetRollReferesh = () => {
//     setIsLoading(false);
//     setleadsbtbrand({ isLoaded: false, data: [] })
//     setAccountPerformance({ isLoaded: false, data: [] })
//     setMonthlydata({ isLoaded: false, data: [] })
//     setYearlydata({ isLoaded: false, data: [] })
//     setBrandData({ isLoaded: false, data: [] })
//     setManufacturerSalesYaer([]);
//     setBox({ RETAILERS: 0, GROWTH: 0, ORDERS: 0, REVENUE: 0, TARGET: 0 })
//     refreshTargetRollOver().then((status) => {
//       if (status) {
//         getDataHandler({ month: selectMonth, year: selectYear });
//       }
//     }).catch((statusErr) => {
//       console.log({ statusErr });
//     })
//   }
//   return (
//     <AppLayout
//       filterNodes={
//         <>
//           <FilterItem
//             minWidth="220px"
//             label="Month-Year"
//             value={selMonth}
//             options={monthList.map((month) => ({
//               label: month.name,
//               value: month.value,
//             }))}
//             onChange={(value) => {
//               changeMonthHandler(value);
//             }}
//             name={"dashboard-manu"}
//           />
//         </>
//       }
//     >
//       <div className="">
//         <div className="row mt-4 justify-between">
//           <div className="col-lg-6 my-2">
//             <div className={Styles.DashboardWidth}>
//               {memoizedPermissions?.modules?.godLevel ? <p className={`${Styles.Tabletext} d-flex justify-content-between align-items-center`}>Month to date(MTD): Sales By Rep
              
//                   <span>{Monthlydataa.isLoaded ?
//                     <BiRefresh className="cursor-pointer" size={25} onClick={targeetRollReferesh} title="Click here for Refresh" />
//                     : null}</span>
            
//               </p> : <p className={Styles.Tabletext}>Month to date(MTD): Sales By Rep</p>}
//               <div className={`${Styles.goaltable} cardShadowHover`}>
//                 <div className="">
//                   <div className={Styles.table_scroll}>
//                     <table className="table table-borderless ">
//                       <thead>
//                         <tr className={Styles.tablerow}>
//                           <th scope="col" className="ps-3">
//                             Sales Rep Name
//                           </th>
//                           <th scope="col">Sale Target</th>
//                           <th scope="col">Sale Amount</th>
//                           <th scope="col">Diff.</th>
//                         </tr>
//                       </thead>
//                       {!Monthlydataa.isLoaded ? (
//                         <IsTableLoading />
//                       ) : (
//                         <>
//                           {Monthlydataa.data ? (
//                             <tbody>
//                               {Monthlydataa.data?.map((e) => {
//                                 // console.log("e.....", e);
//                                 totalTargetForMTDSalesRep = Number(e?.StaticTarget || 0) + Number(totalTargetForMTDSalesRep);
//                                 totalAmountForMTDSalesRep = Number(e.MonthlySale || 0) + Number(totalAmountForMTDSalesRep);
//                                 totalDiffForMTDSalesRep = Number(e?.StaticTarget - e.MonthlySale || 0) + Number(totalDiffForMTDSalesRep);
//                                 let targetDiff = e.TargetRollover
//                                 return (
//                                   <tr key={e}>
//                                     {memoizedPermissions?.modules?.dashboard?.redirect ? <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} onClick={() => { sendDataTargetHandler({ salesRepId: e.SalesRepName }) }} style={{ cursor: 'pointer' }}>
//                                       <UserIcon /> {e.SalesRepName}
//                                     </td> : <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} style={{ pointerEvents: 'none' }}>
//                                       <UserIcon /> {e.SalesRepName}
//                                     </td>}

//                                     <td className={Styles.tabletd}>${formatNumber(e?.StaticTarget || 0)}
//                                       {/* {targetDiff ? (targetDiff > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formatNumber(targetDiff)}</small>+{formatNumber(e.StaticTarget)}</p></> : <><br /><p className={Styles.calHolder}>{formatNumber(e.StaticTarget)}-<small style={{ color: 'green' }}>{formatNumber(-targetDiff)}</small></p></>) : null} */}
//                                     </td>
//                                     <td className={Styles.tabletd}>${formatNumber(e.MonthlySale || 0)}</td>
//                                     {/* <td className={Styles.tabletd}>${formatNumber(e?.diff || 0)}</td> */}
//                                     <td className={`${Styles.tabletd} ${Styles.flex}`}><span style={{ lineHeight: '20px' }}>${formatNumber((Math.abs(e?.StaticTarget - e.MonthlySale)) || 0)}</span>
//                                       <span className={e?.StaticTarget - e.MonthlySale <= 0 ? Styles.matchHolder : Styles.shortHolder}>{e?.StaticTarget - e.MonthlySale <= 0 ? 'MATCH' : 'SHORT'}</span>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                               <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
//                                 <th scope="col" className="ps-3">
//                                   Total
//                                 </th>
//                                 <th scope="col">${formatNumber(totalTargetForMTDSalesRep) ?? "0"}</th>
//                                 <th scope="col">${formatNumber(totalAmountForMTDSalesRep) ?? "0"}</th>
//                                 <th scope="col">${formatNumber(totalDiffForMTDSalesRep) ?? "0"}</th>
//                               </tr>
//                             </tbody>
//                           ) : (
//                             <tbody>
//                               <td></td>
//                               <td>
//                                 <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
//                                   <p className={`${Styles.tablenodata}`}>No Data Found</p>
//                                 </div>
//                               </td>
//                               <td></td>
//                             </tbody>
//                           )}
//                         </>
//                       )}
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* Yearly SALESBYREP */}
//           <div className="col-lg-6 my-2">
//             <div className={Styles.DashboardWidth}>
//               {memoizedPermissions?.modules?.godLevel ? <p className={`${Styles.Tabletext} d-flex justify-content-between align-items-center`}>Year to date(YTD): Sales By Rep
              
//                   <span>{Yearlydataa.isLoaded ? <BiRefresh size={25} className="cursor-pointer" onClick={targeetRollReferesh} title="Click here for Refresh" /> : null}</span>
                
//               </p> : <p className={Styles.Tabletext}>Year to date(YTD): Sales By Rep</p>}
//               <div className={`${Styles.goaltable} cardShadowHover`}>
//                 <div className="">
//                   <div className={Styles.table_scroll}>
//                     <table className="table table-borderless ">
//                       <thead>
//                         <tr className={Styles.tablerow}>
//                           <th scope="col" className="ps-3">
//                             Sales Rep Name
//                           </th>
//                           <th scope="col">Sale Target</th>
//                           <th scope="col">Sale Amount</th>
//                           <th scope="col">Diff.</th>
//                         </tr>
//                       </thead>
//                       {!Yearlydataa.isLoaded ? (
//                         <IsTableLoading />
//                       ) : (
//                         <>
//                           {Yearlydataa.data ? (
//                             <tbody>
//                               {Yearlydataa.data?.map((e, index) => {
//                                 totalTargetForYTDSalesRep = Number(e?.StaticTarget || 0) + Number(totalTargetForYTDSalesRep);
//                                 totalAmountForYTDSalesRep = Number(e.MonthlySale || 0) + Number(totalAmountForYTDSalesRep);
//                                 totalDiffForYTDSalesRep = Number(e?.StaticTarget - e.MonthlySale || 0) + Number(totalDiffForYTDSalesRep);
//                                 let targetDiff = e.TargetRollover
//                                 return (
//                                   <tr key={e}>
//                                     {memoizedPermissions?.modules?.dashboard?.redirect ?
//                                       <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} onClick={() => { sendDataTargetHandler({ salesRepId: e.SalesRepName }) }} style={{ cursor: 'pointer' }}>
//                                         <UserIcon /> {e.SalesRepName}
//                                       </td>
//                                       :
//                                       <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} style={{ pointerEvents: 'none' }}>
//                                         <UserIcon /> {e.SalesRepName}
//                                       </td>
//                                     }

//                                     <td className={Styles.tabletd}>${formatNumber(e?.StaticTarget || 0)}
//                                       {/* {targetDiff ? (targetDiff > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formatNumber(targetDiff)}</small>+{formatNumber(e.StaticTarget)}</p></> : <><br /><p className={Styles.calHolder}>{formatNumber(e.StaticTarget)}-<small style={{ color: 'green' }}>{formatNumber(-targetDiff)}</small></p></>) : null} */}
//                                     </td>
//                                     <td className={Styles.tabletd}>${formatNumber(e.MonthlySale || 0)}</td>
//                                     {/* <td className={Styles.tabletd}>${formatNumber(e?.diff || 0)}</td> */}
//                                     <td className={`${Styles.tabletd} ${Styles.flex}`}><span style={{ lineHeight: '20px' }}>${formatNumber((Math.abs(e?.StaticTarget - e.MonthlySale)) || 0)}</span>
//                                       <span className={e?.StaticTarget - e.MonthlySale <= 0 ? Styles.matchHolder : Styles.shortHolder}>{e?.StaticTarget - e.MonthlySale <= 0 ? 'MATCH' : 'SHORT'}</span>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                               <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
//                                 <th scope="col" className="ps-3">
//                                   Total
//                                 </th>
//                                 <th scope="col">${formatNumber(totalTargetForYTDSalesRep)}</th>
//                                 <th scope="col">${formatNumber(totalAmountForYTDSalesRep)}</th>
//                                 <th scope="col">${formatNumber(totalDiffForYTDSalesRep)}</th>
//                               </tr>
//                             </tbody>
//                           ) : (
//                             <tbody>
//                               <td></td>
//                               <td>
//                                 <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
//                                   <p className={`${Styles.tablenodata}`}>No Data Found</p>
//                                 </div>
//                               </td>
//                               <td></td>
//                             </tbody>
//                           )}
//                         </>
//                       )}
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="row justify-between ">
//           {/* monthly data goal by brand*/}
//           <div className="col-lg-6 col-sm-12 my-2">
//             <div className={Styles.DashboardWidth}>
//               {memoizedPermissions?.modules?.godLevel ? <p className={`${Styles.Tabletext} d-flex justify-content-between align-items-center`}>Month to date(MTD): Goal by Brand
             
//                   <span>{brandData.isLoaded ? <BiRefresh size={25} className="cursor-pointer" onClick={targeetRollReferesh} title="Click here for Refresh" /> : null}</span>
                 
//               </p> : <p className={Styles.Tabletext}>Month to date(MTD): Goal by Brand</p>}
//               <div className={`${Styles.goaltable} cardShadowHover`}>
//                 <div className={Styles.table_scroll}>
//                   <table className="table table-borderless ">
//                     <thead>
//                       <tr className={Styles.tablerow}>
//                         <th className="ps-3">Brand Name</th>
//                         {/* <th>Total Order</th> */}
//                         <th scope="col">Sale Target</th>
//                         <th scope="col">Sale Amount</th>
//                         <th scope="col">Diff.</th>
//                       </tr>
//                     </thead>
//                     <tbody className={Styles.tbdy}>
//                       {!brandData.isLoaded ? (
//                         <IsTableLoading />
//                       ) : (
//                         <>
//                           {brandData.data?.length ? (
//                             <>
//                               {brandData.data?.map((e, i) => {
//                                 totalTargetForMTDGoalBrand = Number(e?.StaticTarget || 0) + Number(totalTargetForMTDGoalBrand);
//                                 totalAmountForMTDGoalBrand = Number(e.MonthlySale || 0) + Number(totalAmountForMTDGoalBrand);
//                                 totalDiffForMTDGoalBrand = Number((Number(e?.StaticTarget - e.MonthlySale || 0)).toFixed(0)) + Number(totalDiffForMTDGoalBrand);
//                                 // console.log({e,i});
//                                 let targetDiff = e.TargetRollover
//                                 return (
//                                   <tr key={e}>
//                                     {memoizedPermissions?.modules?.dashboard?.redirect ?
//                                       <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} onClick={() => { sendDataTargetHandler({ manufacturerId: e.ManufacturerId }) }} style={{ cursor: 'pointer' }}>
//                                         <UserIcon /> {e.brandName}
//                                       </td>
//                                       :
//                                       <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`} style={{ pointerEvent: 'none' }}>
//                                         <UserIcon /> {e.brandName}
//                                       </td>
//                                     }

//                                     <td className={Styles.tabletd}>${formatNumber(e?.StaticTarget || 0)}
//                                       {/* {targetDiff ? (targetDiff > 0 ? <><br /><p className={Styles.calHolder}><small style={{ color: 'red' }}>{formatNumber(targetDiff)}</small>+{formatNumber(e.StaticTarget)}</p></> : <><br /><p className={Styles.calHolder}>{formatNumber(e.StaticTarget)}-<small style={{ color: 'green' }}>{formatNumber(-targetDiff)}</small></p></>) : null} */}
//                                     </td>
//                                     <td className={Styles.tabletd}>${formatNumber(e.MonthlySale || 0)}</td>
//                                     {/* <td className={Styles.tabletd}>${formatNumber(e?.diff || 0)}</td> */}
//                                     <td className={`${Styles.tabletd} ${Styles.flex}`}><span style={{ lineHeight: '20px' }}>${formatNumber((Math.abs(e?.StaticTarget - e.MonthlySale)) || 0)}</span>
//                                       <span className={e?.StaticTarget - e.MonthlySale <= 0 ? Styles.matchHolder : Styles.shortHolder}>{e?.StaticTarget - e.MonthlySale <= 0 ? 'MATCH' : 'SHORT'}</span>
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                               <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
//                                 <th scope="col" className="ps-3">
//                                   Total
//                                 </th>
//                                 <th scope="col">${formatNumber(totalTargetForMTDGoalBrand)}</th>
//                                 <th scope="col">${formatNumber(totalAmountForMTDGoalBrand)}</th>
//                                 <th scope="col">${formatNumber(totalDiffForMTDGoalBrand)}</th>
//                               </tr>
//                             </>
//                           ) : (
//                             <tr>
//                               <td className={` ps-3 ${Styles.tabletd}`}>No data Found.</td>
//                             </tr>
//                           )}
//                         </>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* leads by brand*/}
//           <div className="col-lg-6 col-sm-12 my-2 ">
//             <div className={Styles.DashboardWidth}>
//               <p className={Styles.Tabletext}>Leads by Brand</p>
//               <div className={`${Styles.goaltable1} cardShadowHover`}>
//                 <div className={Styles.table_scroll}>
//                   <table className="table table-borderless mt-2">
//                     <thead>
//                       <tr className={Styles.tablerow}>
//                         <th className="ps-3">Brand Name</th>
//                         <th>Received</th>
//                         <th>Converted</th>
//                       </tr>
//                     </thead>
//                     {!leadsbybrand.isLoaded ? (
//                       <IsTableLoading />
//                     ) : (
//                       <>
//                         {leadsbybrand.data?.length ? (
//                           <tbody className="position-relative">
//                             {leadsbybrand.data.map((element) => {
//                               totalRecieved += element.received;
//                               totalConverted += element.coverted
//                               return (
//                                 <tr key={element}>
//                                   <td className={` ps-3 ${Styles.tabletd}`}>{element.manufacturer}</td>
//                                   <td className={Styles.tabletd}>{element.received}</td>
//                                   <td className={Styles.tabletd}>{element.coverted}</td>
//                                 </tr>
//                               );
//                             })}
//                             <tr className={`${Styles.tablerow} ${Styles.stickyBottom}`}>
//                               <th scope="col" className="ps-3">
//                                 Total
//                               </th>
//                               <th scope="col">{totalRecieved}</th>
//                               <th scope="col">{totalConverted}</th>
//                             </tr>
//                           </tbody>
//                         ) : (
//                           <tbody>
//                             <td></td>
//                             <td>
//                               <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
//                                 <p className={`${Styles.tablenodata}`}>No Data Found</p>
//                               </div>
//                             </td>
//                             <td></td>
//                           </tbody>
//                         )}
//                       </>
//                     )}
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="my-5">
//           {((accountPerformance.data?.length > 0 && accountPerformance?.isLoaded) || !accountPerformance?.isLoaded) && (
//             <div className="row mt-1 justify-between">
//               {/* Top Performing Retailers */}
//               <div className={`col-lg-6 col-sm-12 ${Styles.top_perform1}`}>
//                 <p className={Styles.Tabletext}>Top Performing Retailers</p>
//                 <div className="row">
//                   {!accountPerformance?.isLoaded ? (
//                     <ContentLoader />
//                   ) : (
//                     <>
//                       {accountPerformance.data?.map((ele, index) => {
//                         if (index < 4) {
//                           return (
//                             <div key={index} className="col-lg-6 col-md-6 col-sm-12  ">
//                               <div className={Styles.top_perform}>

//                                 {memoizedPermissions?.modules?.dashboard?.redirect ?
//                                   <Link to={'/store/' + ele.AccountId}>
//                                     <div className={Styles.top_accnew}>
//                                       <p className={Styles.top_accounttext}>{ele.Name}</p>
//                                     </div>
//                                   </Link>

//                                   :
//                                   <span >
//                                     <div className={Styles.top_accnew}>
//                                       <p className={Styles.top_accounttext}>{ele.Name}</p>
//                                     </div>
//                                   </span>
//                                 }


//                                 <div className={`${Styles.scrollbar}`} style={{ cursor: "pointer" }}>
//                                   {ele.ManufacturerList.map((itemm, idx) => {
//                                     const bgcolor = bgColors[itemm.Name];
//                                     return (
//                                       <span
//                                         key={idx}
//                                         className={`${Styles.account} ${Styles[bgcolor]}`}
//                                         onClick={() => handleBrandClick(ele)}

//                                       >
//                                         {itemm.Name}
//                                       </span>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         }
//                         return null;
//                       })}
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Low Performing Retailers */}
//               <div className="col-lg-6 col-sm-12" style={{ width: "48%" }}>
//                 <p className={Styles.Tabletext1}>Low Performing Retailers</p>
//                 <div className="row">
//                   {!accountPerformance?.isLoaded ? (
//                     <ContentLoader />
//                   ) : (
//                     <>
//                       {lowPerformanceArray?.map((ele, index) => {
//                         if (index < 4) {
//                           return (
//                             <div key={index} className="col-lg-6 col-md-6 col-sm-12  cardHover">
//                               <div className={Styles.top_perform2}>
//                                 {memoizedPermissions?.modules?.dasboard?.redirect ?
//                                   <Link to={'/store/' + ele.AccountId}>
//                                     <div className={Styles.top_account}>
//                                       <p className={Styles.top_accounttext}>{ele.Name}</p>
//                                     </div>
//                                   </Link>
//                                   :
//                                   <sapn >
//                                     <div className={Styles.top_account}>
//                                       <p className={Styles.top_accounttext}>{ele.Name}</p>
//                                     </div>
//                                   </sapn>
//                                 }


//                                 <div className={`${Styles.scrollbar}`} style={{ cursor: "pointer" }}>
//                                   {ele.ManufacturerList.map((item, idx) => {
//                                     const bgcolor = bgColors[item.Name];
//                                     return (
//                                       <span
//                                         key={idx}
//                                         className={`${Styles.account22} ${Styles[bgcolor]}`}
//                                         onClick={() => handleBrandClick(ele)}
//                                       >
//                                         {item.Name}
//                                       </span>
//                                     );
//                                   })}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         }
//                         return null;
//                       })}
//                     </>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           <ModalPage
//             open={modalOpen}
//             onClose={() => setModalOpen(false)}
//             content={<SelectBrandModel brands={brandData} onClose={() => setModalOpen(false)}
//               onChange={handleManufacturerSelect}
//             />}
//           />
//         </div>

//         <div className="row my-3">
//           <div className="col-lg-7">
//             <p className={Styles.Tabletext}>Your Sales By Brand</p>

//             <div className={`${Styles.donuttop} cardShadowHover`}>
//               {/* <p className={` text-center mt-3  ${Styles.Tabletextt}`}>Sum of Order</p> */}
//               <p className={`text-end ${Styles.main_heading}`}>Brands</p>
//               {!isLoading ? (
//                 <ContentLoader />
//               ) : (
//                 <Suspense fallback={<ContentLoader />}>
//                   <Chart options={salesByBrandData.options} series={salesByBrandData.series} type="donut" className={Styles.donutchart} width="90%" height="400px" />
//                 </Suspense >
//               )}
//             </div>
//           </div>
//           <div className="col-lg-5">
//             <p className={Styles.Tabletext}>Your Sales Performance Score in {selectYear}</p>
//             <div className={`${Styles.donuttop1} cardShadowHover`}>
//               {!isLoading ? (
//                 <ContentLoader />
//               ) : (
//                 <>
//                   <div className="container">
//                     <p className={`text-end ${Styles.Tabletxt}`}>
//                       Your Target: <span className={Styles.Tabletext_head}>{formatNumber(targetValue) || 0}</span>
//                     </p>
//                     <p className={`text-end ${Styles.Tabletxt1}`}>
//                       Achieved Sales: <span className={Styles.Tabletext_head}>{formatNumber(achievedSales) || 0}</span>
//                     </p>
//                     <div className={Styles.donutbox}>
//                       <PieChart width={320} height={400}>
//                         <Pie dataKey="value" startAngle={180} endAngle={0} data={needle_data} cx={cx} cy={cy} innerRadius={iR} outerRadius={oR} fill="#8884d8" stroke="none">
//                           {needle_data.map((entry, index) => (
//                             <Cell key={`cell-${index}`} fill={entry.color} />
//                           ))}
//                         </Pie>
//                         {needle(value, needle_data, cx, cy, iR, oR, "#000000")}
//                       </PieChart>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="row mt-2 g-4">
//           <div className="col-lg-3 col-md-6 col-sm-6">
//             <div className={`${Styles.dashbottom} cardShadowHover`}>
//               {!isLoading ? <ContentLoader />
//                 : <>
//                   <div className={`text-center  ${Styles.active}`}>
//                     <img src={img1} alt="" className={`text-center ${Styles.iconactive}`} />
//                   </div>
//                   <div className="">
//                     <p className={`text-end ${Styles.activetext}`}>ACTIVE RETAILERS</p>
//                     <h1 className={`text-end ${Styles.activetext1}`}>{box.RETAILERS}</h1>
//                   </div>
//                 </>}
//             </div>
//           </div>
//           <div className="col-lg-3 col-md-6 col-sm-6">
//             <div className={`${Styles.dashbottom} cardShadowHover`}>
//               {!isLoading ? <ContentLoader />
//                 : <>
//                   <div className={`text-center  ${Styles.active}`}>
//                     <img src={img2} alt="" className={`text-center ${Styles.iconactive}`} />
//                   </div>
//                   <div className="">
//                     <p className={`text-end ${Styles.activetext}`}>GROWTH {selectYear - 1} VS {selectYear}</p>
//                     <h1 className={`text-end ${Styles.activetext1}`}>
//                       {box.GROWTH}<span>%</span>
//                     </h1>
//                   </div>
//                 </>}
//             </div>
//           </div>
//           <div className="col-lg-3 col-md-6 col-sm-6">
//             <div className={`${Styles.dashbottom} cardShadowHover`}>
//               {!isLoading ? <ContentLoader />
//                 : <>
//                   <div className={`text-center  ${Styles.active}`}>
//                     <img src={img3} alt="" className={`text-center ${Styles.iconactive3}`} />
//                   </div>
//                   <div className="">
//                     <p className={`text-end ${Styles.activetext}`}>TOTAL NO. OF ORDERS</p>
//                     <h1 className={`text-end ${Styles.activetext1}`}>{box.ORDERS >= 1000 ? Number((Number(box.ORDERS) / 1000).toFixed(0)) + 'K' : box.ORDERS}</h1>
//                   </div>
//                 </>}
//             </div>
//           </div>
//           <div className="col-lg-3 col-md-6 col-sm-6">
//             <div className={`${Styles.dashbottom} cardShadowHover`}>
//               {!isLoading ? <ContentLoader />
//                 : <>
//                   <div className={`text-center  ${Styles.active}`}>
//                     <img src={img4} alt="" className={`text-center ${Styles.iconactive4}`} />
//                   </div>
//                   <div className="">
//                     <p className={`text-end ${Styles.activetext}`}>REVENUE</p>
//                     <h1 className={`text-end ${Styles.activetext1}`}>${formatNumber(box.REVENUE)}</h1>
//                   </div>
//                 </>}
//             </div>
//           </div>
//         </div>
//         <Suspense fallback={<ContentLoader />}>
//           <GraphHandler options={dataa.options} manufacturerSalesYear={manufacturerSalesYear} Styles={Styles} />
//         </Suspense>
//       </div>
//     </AppLayout>
//   );
// }

// export default Dashboard;





import React from 'react';
import AppLayout from "../AppLayout";
const Dashboard = () => {
  return (
    <AppLayout>
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1> */}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-emerald-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold">Users</h3>
          <p className="text-2xl font-bold mt-2">1,245</p>
        </div>
        <div className="bg-blue-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-2xl font-bold mt-2">$45,900</p>
        </div>
        <div className="bg-indigo-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold">Orders</h3>
          <p className="text-2xl font-bold mt-2">230</p>
        </div>
        <div className="bg-red-500 text-white rounded-xl p-6 shadow">
          <h3 className="text-lg font-semibold">Issues</h3>
          <p className="text-2xl font-bold mt-2">12</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Chart Placeholder</h2>
        <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-500 text-sm rounded-lg">
          [ Chart goes here ]
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl p-6 shadow">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm">👤 User John registered</li>
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm">🛒 Order #1023 placed</li>
          <li className="bg-gray-50 p-4 rounded-lg shadow-sm">✅ Issue #12 resolved</li>
        </ul>
      </div>
    </div>
    </AppLayout>
  
  );
};

export default Dashboard;
