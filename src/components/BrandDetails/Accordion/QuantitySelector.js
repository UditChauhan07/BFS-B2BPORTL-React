import React, { useEffect, useState } from "react";

const padWithZero = (value) => {
  return String(value).padStart("2", "0");
};

const QuantitySelector = ({ onChange, value = 0, min = 0 }) => {
  useEffect(() => {
    if (value !== 0 && value < min) {
      onChange?.(min);
    }
  }, [value, min]);

  return (
    <div className="w-[85px] h-[27px] flex border-[0.5px] border-solid border-black">
      <button
        onClick={() => {
          let newValue = value;
          if (newValue > min) {
            newValue = newValue - 1;
          } else {
            newValue = 0;
          }
          onChange?.(newValue);
        }}
        className="px-[8px] h-full bg-[#f8fafb] border-r-[0.5px] border-solid border-black"
      >
        -
      </button>

      <input
        type="number"
        value={padWithZero(value)}
        className="w-full text-center text-[12px] leading-tight appearance-none"
      />
      <button
        onClick={() => {
          let newValue = value + 1;
          onChange?.(newValue);
        }}
        className="px-[8px] h-full bg-[#f8fafb] border-l-[0.5px] border-solid border-black"
      >
        +
      </button>

      {/* <div className="w-[85px] h-[27px]">
        <div className="relative w-[87px] h-[29px] -top-px -left-px">
          <div className="w-[86px] left-px bg-white absolute h-[29px] top-0 border-[0.5px] border-solid border-black" />
          <div className="w-[25px] left-0 bg-[#f8fafb] absolute h-[29px] top-0 border-[0.5px] border-solid border-black" />
          <div className="w-[25px] left-[62px] bg-[#f8fafb] absolute h-[29px] top-0 border-[0.5px] border-solid border-black" />
          <div className="w-[8px] left-[9px] absolute top-[6px] [font-family:'Lato-Regular',Helvetica] font-normal text-black text-[14px] tracking-[0] leading-[normal]">
            −
          </div>
          <div className="w-[9px] left-[71px] text-center absolute top-[6px] [font-family:'Lato-Regular',Helvetica] font-normal text-black text-[14px] tracking-[0] leading-[normal]">
            +
          </div>
          <div className="absolute w-[26px] top-[8px] left-[31px] [font-family:'Arial-Regular',Helvetica] font-normal text-[#212121] text-[12px] text-center tracking-[1.12px] leading-[normal]">
            08
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default QuantitySelector;
