import React, { useState } from "react";
import Styles from "./style.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import ModalPage from "../../Modal UI";
import modalStyles from "../../Modal UI/Styles.module.css";

const SelectBrandModel = ({ brands, onClose }) => {
  // const [selectedBrandAccountId, setSelectedBrandAccountId] = useState();
  const [selectedBrandManufacturer, setSelectedBrandManufacturer] =
    useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const navigate = useNavigate();
  return (
    <>
      {modalOpen ? (
        <ModalPage
          open
          content={
            <>

              <div style={{ maxWidth: "309px" }}>
                <h1 className={`fs-5 ${modalStyles.ModalHeader}`}>Warning</h1>

                <p className={` ${modalStyles.ModalContent}`}>
                  Please Select Manufacturer
                </p>
                <div className="d-flex justify-content-center">
                  <button
                    class={`${modalStyles.modalButton}`}
                    onClick={() => setModalOpen(false)}
                  >
                    OK
                  </button>
                </div>
              </div>
            </>
          }
          onClose={() => setModalOpen(false)}
        />
      ) : null}
      <div className="px-[68px] pb-[67px] pt-[40px] max-w-[900px]">
        <section >
          <div class="modal-header d-flex justify-content-end align-item-end" onClick={onClose}>
            <button type="button" class="btn-close" aria-label="Close"></button>
          </div>
          <h1 className="font-[Montserrat-500] text-[22px] tracking-[2.20px] mb-[20px] text-center mt-4">
            Choose the Manufacturer
          </h1>
   
           <div className={Styles.BrandInRadio}>
            <div className={Styles.ModalResponsive}>
              {brands?.map((brand, index) => (
                <div className={Styles.BrandName} key={index}>
                  <input
                    type="radio"
                    name="brand_names"

                    // onChange={() => {
                    //   setSelectedBrandManufacturer(true);
                    //   localStorage.setItem(
                    //     "manufacturer",
                    //     brand.ManufacturerName__c
                    //   );
                    //   localStorage.setItem(
                    //     "ManufacturerId__c",
                    //     brand.ManufacturerId__c
                    //   );
                    // }}
                    onClick={() => {
                      setSelectedBrandManufacturer(true);
                      localStorage.setItem(
                        "manufacturer",
                        brand.ManufacturerName__c
                      );
                      localStorage.setItem(
                        "ManufacturerId__c",
                        brand.ManufacturerId__c
                      );
                      navigate(`/product`);


                    }}


                    id={brand.ManufacturerName__c}
                  />
                  <label htmlFor={brand.ManufacturerName__c}>
                    {brand.ManufacturerName__c}
                  </label>
                </div>
              ))}
            </div>

            <div className={Styles.BrandButton}>
              {/* <button className={Styles.Button1} onClick={onClose}>
                CANCEL
              </button> */}
              {/* <button
                className={Styles.Button2}
                onClick={() => {
                  if (selectedBrandManufacturer) {
                    navigate(`/product`);
                  } else {
                    setModalOpen(true);
                  }
                }}
              >
                SUBMIT
              </button> */}
            </div>
          </div>

         
        </section>
      </div>
    </>
  );
};

export default SelectBrandModel;
