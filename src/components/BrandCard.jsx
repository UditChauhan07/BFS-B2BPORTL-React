import React from "react";
import { useNavigate } from "react-router-dom";
import Page from '../pages/page.module.css'

const BrandCard = ({ brand, image }) => {
  const navigate = useNavigate();
  return (
    <div className={`w-full last:mb-0 mb-4 ${Page.HoverArrow}`}>
      <div className={`border-b-[0.5px] border-[#D0CFCF] flex flex-col gap-4 h-full  ${Page.ImgHover1}`} >
        {image ? (
          <div className={`border-[0.5px]  relative  border-[#D0CFCF] ${Page.ImgHover}`}>
            <img
              src={`/assets/images/${image}`}
              className="object-scale-down max-h-[200px] h-full w-full"
              alt="img"
            />
          </div>
        ) : null}
        <div className="flex justify-between items-start h-full px-[10px]"
          onClick={() => {
            if (brand?.Accounds)
              navigate(`/my-retailers?manufacturerId=${brand.Id}`)
          }
          }

        >
          <div className="flex flex-col justify-between h-full">
            <div className="font-medium text-black text-[20px] tracking-[1.12px] leading-[20px] [font-family:'Arial-500']">
              {brand.Name}
            </div>

            <button
              className="flex items-center gap-2"
            // onClick={() => {
            //   if (brand?.Accounds)
            //     navigate(`/my-retailers?manufacturerId=${brand.Id}`)
            // }
            // }
            >
              <div className="[font-family:'Montserrat-400'] font-normal text-black text-[12px] tracking-[0] leading-[32px] whitespace-nowrap">
                SHOW RETAILERS
              </div>
              {/* <img src={"/assets/images/ArrowRight.svg"} alt="img" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                <path d="M13 4L13.3825 3.67793L13.6537 4L13.3825 4.32207L13 4ZM1 4.5C0.723858 4.5 0.5 4.27614 0.5 4C0.5 3.72386 0.723858 3.5 1 3.5V4.5ZM10.8561 0.677932L13.3825 3.67793L12.6175 4.32207L10.0912 1.32207L10.8561 0.677932ZM13.3825 4.32207L10.8561 7.32207L10.0912 6.67793L12.6175 3.67793L13.3825 4.32207ZM13 4.5H1V3.5H13V4.5Z" fill="black" />
              </svg>
            </button>
          </div>
          <div className="bg-black rounded-full w-[40px] h-[40px] flex justify-center items-center">
            <div className="font-medium text-white text-[20px] whitespace-nowrap h-[40px] w-[40px] flex justify-center items-center  ">
              {brand?.Accounds}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandCard;
