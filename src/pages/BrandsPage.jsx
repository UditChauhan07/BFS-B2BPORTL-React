import React, { useEffect, useMemo, useState } from "react";
import BrandCard from "../components/BrandCard";
import { FilterItem } from "../components/FilterItem";
import FilterSearch from "../components/FilterSearch";
import { useManufacturer } from "../api/useManufacturer";
import Loading from "../components/Loading";
import { useNavigate } from "react-router";
import Layout from "../components/Layout/Layout";


import Page from './page.module.css'

const brandsImageMap = {
  Diptyque: "Diptyque.png",
  Byredo: "Byredo.png",
  "Maison Margiela": "Maison Margiela.png",
  "Bobbi Brown": "Bobbi Brown.png",
  "ESTEE LAUDER": "Estee Lauder.png",
  "RMS Beauty": "rmsbeauty.png",
  ReVive: "revive.png",
  "R Co ": "R co.png",
  "R Co Bleu": "R co Bleu.png",
  "Bumble and Bumble": "Bumblea and Bumble.png",
  "BY TERRY": "By Terry.png",
  "Susanne Kaufmann": "susanne kaufman.png",
  "Kevyn Aucoin Cosmetics": "Kevyn Aucoin.jpg",
  Smashbox: "Smashbox-3.png",
  "EVE LOM": "Evelom.png",
  AERIN: "Aerin.png",
  ARAMIS: "Aramis.png",
  "Victoria Beckham Beauty": "victoria.png",
  "Re-Nutriv": "Re-Nutriv-2.png",
};

const defaultImage = "default.jpg";

const BrandsPage = () => {
  const { data: manufacturers, isLoading, error } = useManufacturer();
  const [highestRetailers, setHighestRetailers] = useState(true);
  const [searchBy, setSearchBy] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("Name");
    if (!userData) {
      navigate("/");
    }
  }, []);
  const filteredPageData = useMemo(() => {
    if (!Array.isArray(manufacturers?.data)) {
      return [];
    }
    let newValues = manufacturers?.data?.map((brand) => brand);

    if (searchBy) {
      newValues = newValues?.filter((value) =>
        value.Name?.toLowerCase().includes(searchBy?.toLowerCase())
      );
    }
    if (highestRetailers) {
      newValues = newValues?.sort((a, b) => b.Accounds - a.Accounds);
    } else {
      newValues = newValues?.sort((a, b) => a.Accounds - b.Accounds);
    }
    return newValues;
  }, [highestRetailers, searchBy, manufacturers]);
  return (
    <>
    <Layout>
            <div>
                <div className="col-12">
                <div className="filter-container">
            <FilterItem
              minWidth="220px"
              label="Lowest Retailers"
              value={highestRetailers}
              options={[
                {
                  label: "Highest Retailers",
                  value: true,
                },
                {
                  label: "Lowest Retailers",
                  value: false,
                },
              ]}
              onChange={(value) => setHighestRetailers(value)}
            />
            <FilterSearch
              onChange={(e) => setSearchBy(e.target.value)}
              value={searchBy}
              placeholder={"Search  by  brand"}
            />
            <button
              className="border px-2.5 py-1 leading-tight"
              onClick={() => {
                setHighestRetailers(true);
                setSearchBy("");
              }}
            >
              CLEAR ALL
            </button>
          </div>


                </div>
                <div>

                <div className="col-12 p-0">
          {isLoading ? (
            <Loading height={"70vh"} />
          ) : (
            <div>
              <div
                className="uppercase text-center flex justify-center items-center tracking-[1.8px] my-[48px]"
                style={{ fontFamily: "Montserrat-500" }}
              >
                Below are the Brands available with “Beauty Fashions Sales
                Group”
              </div>
              {/* <div className="widthGivenBrandDetailPage grid sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 grid-cols-2 gap-4  m-auto">    */}   
              <div className={` ${Page.widthGivenBrandDetailPage}`}> 
                {filteredPageData?.length ? (
                  <>
                    {filteredPageData?.map((brand) => (
                      <BrandCard
                        image={brandsImageMap[brand?.Name] || defaultImage}
                        brand={brand}
                      />
                    ))}
                  </>
                ) : null}
              </div>
              {!filteredPageData?.length && (
                <div className="lg:min-h-[300px] xl:min-h-[380px]">
                  <div className="flex justify-center items-center py-4 w-full lg:min-h-[300px] xl:min-h-[380px]">
                    No data found
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
                    {/* <OrderStatusFormSection /> */}
                </div>
            </div>
        </Layout>



        </>
  )
  ;
};

export default BrandsPage;
