import React, { useEffect, useState } from "react";
import Styles from "./Dashboard.module.css";
import Chart from "react-apexcharts";
import Loading from "../Loading";
import img1 from "./Images/Active-1.png";
import img2 from "./Images/Vector.png";
import img3 from "./Images/Group.png";
import img4 from "./Images/Group1.png";
import img5 from "./Images/Rectangle 304.png";
import { PieChart, Pie, Cell } from "recharts";
import axios, { formToJSON } from "axios";
import { useNavigate } from "react-router-dom";

const dataa = {
  series: [
    {
      name: "Diptyque",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Byredo",
      data: [76, 85, 87, 98, 87, 97, 91, 74, 94],
    },
    {
      name: "Bobbi Brown",
      data: [16, 25, 37, 48, 57, 67, 73, 84, 94],
    },
    {
      name: "By Terry",
      data: [6, 15, 23, 35, 41, 53, 66, 74, 87],
    },
    {
      name: "Revive",
      data: [2, 12, 21, 30, 33, 42, 37, 41, 54],
    },
    {
      name: "Kevyn Aucoin",
      data: [71, 88, 83, 91, 82, 99, 61, 70, 98],
    },
    {
      name: "Smashbox",
      data: [10, 12, 14, 11, 16, 20, 24, 29, 32],
    },
  ],
  options: {
    chart: {
      type: "area",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },

    dataLabels: {
      enabled: false,
    },
    colors: ["#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#76a5af", "#6fa8dc", "#d5a6bd"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0.2,
      },
    },

    xaxis: {
      categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September"],
    },
    yaxis: {
      title: {
        text: "$ (thousands)",
      },
    },

    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " thousands";
        },
      },
    },
  },
};




// const data = {
//   series: [44, 55, 41, 17, 35], //static

//   options: {
//     chart: {
//       type: "donut",
//     },
//     labels: {
//       show: true,
//       name: {
//         show: true,
//         offsetY: 38,
//         formatter: () => "out of 553 points",
//       },
//     },
//     plotOptions: {
//       pie: {
//         donut: {
//           labels: {
//             show: true,

//             total: {
//               show: true,
//               showAlways: true,
//               formatter: function (w) {
//                 const t = w.globals.seriesTotals;
//                 const result = t.reduce((a, b) => a + b, 0);
//                 return (result / 10000).toFixed(1);
//               },
//             },
//           },
//         },
//       },
//     },

//     responsive: [
//       {
//         breakpoint: 480,
//         options: {
//           chart: {
//             width: "100px",
//           },
//         },
//       },
//     ],
//     colors: ["#ea9999", "#f9cb9c", "#6fa8dc", "#b6d7a8", "#76a5af"],
//     labels: ["BY TERRY", "Bobbi Brown", "Bumble and Bumble", "ReVive", "RMS Beauty"],
//   },
// };

function Dashboard(props) {
  const bgColors = {
    "Kevyn Aucoin Cosmetics": "KevynAucoinCosmeticsBg",
    "Bumble and Bumble": "BumbleandBumbleBg",
    "BY TERRY": "BYTERRYBg",
    "Bobbi Brown": "BobbiBrownBg",
    ReVive: "ReViveBg",
    "Maison Margiela": "MaisonMargielaBg",
    Smashbox: "SmashboxBg",
    "RMS Beauty": "RMSBeautyBg",
    "ESTEE LAUDER": "esteeLauderBg",
  };
  const [tabledata, settabledata] = useState([]);
  const [leadsbybrand, setleadsbtbrand] = useState([]);
  const [Monthlydataa, setMonthlydata] = useState([]);
  const [Yearlydataa, setYearlydata] = useState([]);
  const [nameacc, setnameacc] = useState([]);
  const [nameacc1, setnameacc1] = useState([]);
  const [nameacc2, setnameacc2] = useState([]);
  const [manufacturelist, setmanufaacturelist] = useState([]);
  const [manufacturelist1, setmanufaacturelist1] = useState([]);
  const [manufacturelist2, setmanufaacturelist2] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const RADIAN = Math.PI / 180;
  const needle_data = [
    { name: "A", value: 80, color: "#16BC4E" },
    { name: "B", value: 45, color: "#C7C7C7" },
  ];
  const cx = 150;
  const cy = 200;
  const iR = 50;
  const oR = 100;
  const value = 50;

  const needle = (value, data, cx, cy, iR, oR, color) => {
    let total = 0;
    needle_data.forEach((v) => {
      total += v.value;
    });
    const ang = 180.0 * (1 - value / total);
    const length = (iR + 2.4 * oR) / 3;
    const sin = Math.sin(-RADIAN * ang);
    const cos = Math.cos(-RADIAN * ang);
    const r = 5;
    const x0 = cx + 5;
    const y0 = cy + 5;
    const xba = x0 + r * sin;
    const yba = y0 - r * cos;
    const xbb = x0 - r * sin;
    const ybb = y0 + r * cos;
    const xp = x0 + length * cos;
    const yp = y0 + length * sin;

    return [<circle cx={x0} cy={y0} r={r} fill={color} stroke="none" />, <path d={`M${xba} ${yba}L${xbb} ${ybb} L${xp} ${yp} L${xba} ${yba}`} stroke="#none" fill={color} />];
  };
  const navigate = useNavigate();




  const data = {
    series: tabledata.map((ele) => {
      return [(ele.totalOrder)]
    }),


    // [44, 55, 41, 17, 35],

    options: {
      chart: {
        type: "donut",
      },
      labels: {
        show: true,
        name: {
          show: true,
          offsetY: 38,
          formatter: () => "out of 553 points",
        },
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,

              total: {
                show: true,
                showAlways: true,
                formatter: function (w) {
                  const t = w.globals.seriesTotals;
                  const result = t.reduce((a, b) => a + b, 0);
                  return (result / 10000).toFixed(1);
                },
              },
            },
          },
        },
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "100px",
            },
          },
        },
      ],
      colors: ["#ea9999", "#f9cb9c", "#6fa8dc", "#b6d7a8", "#76a5af"],
      labels: ["BY TERRY", "Bobbi Brown", "Bumble and Bumble", "ReVive", "RMS Beauty"],
    },
  };







  // API INTEGRATION

  useEffect(() => {
    if (localStorage.getItem("Name")) {
      let formData = JSON.parse(localStorage.getItem("response"))


      // GOAL BY BRAND (MONTHLY)
      let filteredAarray = [];
      setIsLoading(true);
      const values = JSON.parse(formData.data.data.details);
      let key = Object.keys(values.brandSalesByRep.data).map((ele) => ele);
      let ans = values.brandSalesByRep.raw.map((ele) => {
        key.map((item) => {
          if (ele === item) {
            filteredAarray.push(values.brandSalesByRep.data[item]);
          } else {
          }
        });
      });
      settabledata(filteredAarray);


      // LEADS BY BRAND || MONTHLY SALESBYREP || YEARLY SALESBYREP
      let leadsdata = [];
      let MonthlyData = [];
      let YearlyData = [];
      const valuess = JSON.parse(formData.data.data.details);
      let keyy = Object.keys(values.lead.data).map((ele) => ele);
      let anss = values.lead.raw.map((ele) => {
        keyy.map((item) => {
          if (ele === item) {
            leadsdata.push(values.lead.data[item]);
          } else {
          }
        });
      });


      //       // MONTHLY SALES BY REP
      let keey = Object.keys(valuess.monthly.data).map((ele) => ele);
      let annss = valuess.monthly.raw.map((ele) => {
        keey.map((item) => {
          if (ele === item) {
            MonthlyData.push(valuess.monthly.data[item]);
          } else {
          }
        });
      });


      //       // YEAR SALES BY REP
      let KEY = Object.keys(values.yearly.data).map((ele) => ele);
      let ANS = values.yearly.raw.map((ele) => {
        keey.map((item) => {
          if (ele === item) {
            YearlyData.push(values.yearly.data[item]);
          } else {
          }
        });
      });

      setleadsbtbrand(leadsdata);
      setMonthlydata(MonthlyData);
      setYearlydata(YearlyData);


      // PERFORMANCE
      setnameacc(values.performance.data[0].Name);
      setnameacc1(values.performance.data[1].Name);
      setnameacc2(values.performance.data[2].Name);
      setmanufaacturelist(values.performance.data[0].ManufacturerList);
      setmanufaacturelist1(values.performance.data[1].ManufacturerList);
      setmanufaacturelist2(values.performance.data[2].ManufacturerList);
      setIsLoading(false);

    } else {
      navigate("/");
    }
  }, []);
  const date = new Date();
  const options = {
    year: "numeric",
    month: "long",
  };
  let current = date.toLocaleString("en-IN", options);

  return (
    <>
      {isLoading ? (
        <Loading height="80vh" />
      ) : (
        <div className="">
          <div className={Styles.head_topp}></div>
          <select className={`mt-3  ${Styles.drpp}`} aria-label="Default select example">
            <option selected className="">
              {current}
            </option>
            {/* <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="3">April</option>
                <option value="3">May</option>
                <option value="3">June</option>
                <option value="3">July</option>
                <option value="3">August</option>
                <option value="3">September</option>
                <option value="3">October</option>
                <option value="3">November</option>
                <option value="3">December</option> */}
          </select>
          <hr className="w-100" />

          <div className="row">
            {/* monthly data goal by brand*/}
            <div className="col-lg-6 my-2">
              <p className={Styles.Tabletext}>Month bill date(MTD): Goal by Brand</p>
              <div className={Styles.goaltable}>
                
                  <div className={Styles.table_scroll}>
                    <table className="table table-borderless ">
                      <thead>
                        <tr className={Styles.tablerow}>
                          <th className="ps-3">Manufacturer</th>
                          <th>Total Order</th>
                          <th>Sale</th>
                          <th>Sale Target</th>
                        </tr>
                      </thead>

                      <tbody className={Styles.tbdy}>
                        {tabledata?.map((e) => {
                          return (
                            <tr key={e}>
                              <td className={` ps-3 ${Styles.tabletd}`}>{e.ManufacturerName}</td>
                              <td className={Styles.tabletd}>{e.totalOrder}</td>
                              <td className={Styles.tabletd}>${Number(e.sale).toFixed(2)}</td>
                              <td className={Styles.tabletd}>${e.target}K</td>
                            </tr>
                          );

                        })}
                      </tbody>
                    </table>
                  </div>
                
              </div>
            </div>
            {/* leads by brand*/}
            <div className="col-lg-6 my-2">
              <p className={Styles.Tabletext}>Leads by Brand</p>
              <div className={Styles.goaltable1}>
                <div className=" container">
                  <table class="table table-borderless mt-2">
                    <thead>
                      <tr className={Styles.tablerow}>
                        <th className="ps-3">Manufacturer</th>
                        <th>Received</th>
                        <th>Converted</th>
                      </tr>
                    </thead>

                    {leadsbybrand == true ? (
                      <tbody className="position-relative">
                        {leadsbybrand.map((element) => {
                          return (
                            <tr key={element}>
                              <td className={` ps-3 ${Styles.tabletd}`}>{element.ManufacturerName}</td>
                              <td className={Styles.tabletd}>{element.received}</td>
                              <td className={Styles.tabletd}>{element.converted}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      <tbody>
                        <td></td>
                        <td>
                          <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                            <p className={`${Styles.tablenodata}`}>No Data Found</p>
                          </div>
                        </td>
                        <td></td>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            {/* Monthly SALESBYREP */}
            <div className="col-lg-6 my-2">
              <p className={Styles.Tabletext}>Month bill date(MTD): Sales By Rep</p>
              <div className={Styles.goaltable}>
                <div className="container">
                  <div className={Styles.table_scroll}>

                    <table class="table table-borderless ">
                      <thead>
                        <tr className={Styles.tablerow}>
                          <th scope="col" className="ps-3">
                            Opportunity Owner
                          </th>
                          <th scope="col">Sum of Amount</th>
                        </tr>
                      </thead>


                      {Monthlydataa ? (
                        <tbody>
                          {Monthlydataa?.map((e) => {
                            return (
                              <tr key={e}>
                                <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`}>
                                  <img src={img5} className="h-100" alt="" /> {e.salesRepName}
                                </td>
                                <td className={Styles.tabletd}>${(Number(e.total.revenue) / 1000).toFixed(0)}K</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <td></td>
                          <td>
                            <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                              <p className={`${Styles.tablenodata}`}>No Data Found</p>
                            </div>
                          </td>
                          <td></td>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* Yearly SALESBYREP */}
            <div className="col-lg-6 my-2">
              <p className={Styles.Tabletext}>Year bill date(MTD): Sales By Rep</p>
              <div className={Styles.goaltable}>
                <div className="container">
                  <div className={Styles.table_scroll}>
                    <table class="table table-borderless ">
                      <thead>
                        <tr className={Styles.tablerow}>
                          <th scope="col" className="ps-3">
                            Opportunity Owner
                          </th>
                          <th scope="col">Sum of Amount</th>
                        </tr>
                      </thead>



                      {Yearlydataa ? (
                        <tbody>
                          {Yearlydataa?.map((e) => {
                            return (
                              <tr key={e}>
                                <td className={`${Styles.tabletd} ps-3 d-flex justify-content-start align-items-center gap-2`}>
                                  <img src={img5} className="h-100" alt="" /> {e.salesRepName}
                                </td>
                                <td className={Styles.tabletd}>${(Number(e.total.revenue) / 1000).toFixed(0)}K</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <td></td>
                          <td>
                            <div className={`d-flex justify-content-start align-items-center`} style={{ minHeight: "230px" }}>
                              <p className={`${Styles.tablenodata}`}>No Data Found</p>
                            </div>
                          </td>
                          <td></td>
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="row mt-5">
            <div className="col-lg-6">
              <p className={Styles.Tabletext}>Top Performing Accounts</p>
            </div>
            <div className="col-lg-6">
              <p className={Styles.Tabletext1}>Low Performing Accounts</p>
            </div>
          </div> */}
          <div className="my-5">

          <div className="row mt-1">
            <div className={`col-lg-6 ${Styles.top_perform1}`}>
            <p className={Styles.Tabletext}>Top Performing Accounts</p>
              <div className="row">
                {/* TOP PERFORMANCE */}
                <div className="col-lg-6 col-md-6  ">
                  <div className={Styles.top_perform}>
                    <div className="container">
                      <div className={Styles.top_account}>
                        <p className={Styles.top_accounttext}>{nameacc}</p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist.map((itemm) => {
                          const bgcolor = bgColors[itemm.Name];
                          return <span className={`${Styles.account} ${Styles[bgcolor]}`}>{itemm.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={` ${Styles.top_perform}`}>
                    <div className="container">
                      <div className={Styles.top_account}>
                        <p className={Styles.top_accounttext}>{nameacc2}</p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist2.map((item) => {
                          const bgcolor = bgColors[item.Name];
                          return <span className={`${Styles.account22} ${Styles[bgcolor]}`}>{item.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className={Styles.top_perform}>
                    <div className="container">
                      <div className={Styles.top_account}>
                        <p className={Styles.top_accounttext}>{nameacc1}</p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist1.map((item) => {
                          const bgcolor = bgColors[item.Name];

                          return <span className={`${Styles.account22} ${Styles[bgcolor]}`}>{item.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
            <p className={Styles.Tabletext1}>Low Performing Accounts</p>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  {/* LOW PERFORMANCE */}
                  <div className={Styles.top_perform2}>
                    <div className="container">
                      <div className={Styles.top_accnew}>
                        <p className={Styles.top_accounttext}>{nameacc2}</p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist2.map((item) => {
                          const bgcolor = bgColors[item.Name];
                          return <span className={`${Styles.account22} ${Styles[bgcolor]}`}>{item.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={` ${Styles.top_perform2}`}>
                    <div className="container">
                      <div className={Styles.top_accnew}>
                        <p className={Styles.top_accounttext}>{nameacc} </p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist.map((itemm) => {
                          const bgcolor = bgColors[itemm.Name];
                          return <span className={`${Styles.account} ${Styles[bgcolor]}`}>{itemm.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className={Styles.top_perform}>
                    <div className="container">
                      <div className={Styles.top_accnew}>
                        <p className={Styles.top_accounttext}>{nameacc1}</p>
                      </div>

                      <div className={` ${Styles.scrollbar}`}>
                        {manufacturelist1.map((item) => {
                          const bgcolor = bgColors[item.Name];
                          return <span className={`${Styles.account22} ${Styles[bgcolor]}`}>{item.Name}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>


          <div className="row my-5">
            <div className="col-lg-7">
              <p className={Styles.Tabletext}>Sales By Brand</p>

              <div className={Styles.donuttop}>
                <p className={` text-center mt-3  ${Styles.Tabletextt}`}>Sum of Ordered</p>
                <p className={`text-end ${Styles.main_heading}`}>MANUFACTURER</p>
                <Chart options={data.options} series={data.series} type="donut" className={Styles.donutchart} width="90%" />
              </div>
            </div>

            <div className="col-lg-5">
              <p className={Styles.Tabletext}>Your Sales Performance Score in 2023</p>
              <div className={Styles.donuttop1}>
                <div className="container">
                  <p className={`text-end ${Styles.Tabletxt}`}>
                    Your Target: <span className={Styles.Tabletext_head}>300k</span>
                  </p>
                  <p className={`text-end ${Styles.Tabletxt1}`}>
                    Achieved Sales: <span className={Styles.Tabletext_head}>285k</span>
                  </p>
                  <div className={Styles.donutbox}>
                    <PieChart width={400} height={400}>
                      <Pie dataKey="value" startAngle={180} endAngle={0} data={needle_data} cx={cx} cy={cy} innerRadius={iR} outerRadius={oR} fill="#8884d8" stroke="none">
                        {needle_data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      {needle(value, data, cx, cy, iR, oR, "#000000")}
                    </PieChart>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5 g-4">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                
                      <div className={`text-center  ${Styles.active}`}>
                        <img src={img1} alt="" className={`text-center ${Styles.iconactive}`} />
                
                    </div>
                    <div className="">
                      <p className={`text-end ${Styles.activetext}`}>ACTIVE RETAILERS</p>
                      <h1 className={`text-end ${Styles.activetext1}`}>06</h1>
                    </div>
                
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                
                      <div className={`text-center  ${Styles.active}`}>
                        <img src={img2} alt="" className={`text-center ${Styles.iconactive}`} />
                
                    </div>
                    <div className="">
                      <p className={`text-end ${Styles.activetext}`}>GROWTH 2022 VS 2023</p>
                      <h1 className={`text-end ${Styles.activetext1}`}>78</h1>
                    </div>
                
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                
                      <div className={`text-center  ${Styles.active}`}>
                        <img src={img3} alt="" className={`text-center ${Styles.iconactive3}`} />
                
                    </div>
                    <div className="">
                      <p className={`text-end ${Styles.activetext}`}>TOTAL NO.ORDERS</p>
                      <h1 className={`text-end ${Styles.activetext1}`}>135K</h1>
                    </div>
                
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className={Styles.dashbottom}>
                
                      <div className={`text-center  ${Styles.active}`}>
                        <img src={img4} alt="" className={`text-center ${Styles.iconactive4}`} />
                
                    </div>
                    <div className="">
                      <p className={`text-end ${Styles.activetext}`}>REVENUE</p>
                      <h1 className={`text-end ${Styles.activetext1}`}>$680K</h1>
                    </div>
                
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="container">
              <p className={Styles.Tabletext}>Total Sale By Brand</p>
              <div className={Styles.graphmain}>
                <Chart options={dataa.options} series={dataa.series} type="area" width="100%" height="100%" />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;
