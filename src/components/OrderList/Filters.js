import React from "react";
import { FilterItem } from "../FilterItem";
import { useManufacturer } from "../../api/useManufacturer";
import FilterSearch from "../FilterSearch";

const Filters = ({ value, onChange, resetFilter }) => {
  const { data: manufacturerData } = useManufacturer();
  const handleMonthFilter = (v) => onChange("month", v);
  const handleManufacturerFilter = (v) => onChange("manufacturer", v);
  const handleSearchFilter = (v) => onChange("search", v);

  return (
    <>
      <FilterItem
        label="Months"
        value={value.month}
        options={[
          {
            label: "Last 6 Months",
            value: "last-6-months",
          },
          {
            label: "Current Year",
            value: `${new Date().getFullYear()}`,
          },
          {
            label: `${new Date().getFullYear() - 1}`,
            value: `${new Date().getFullYear() - 1}`,
          },
        ]}
        onChange={handleMonthFilter}
      />
      <FilterItem
        label="MANUFACTURER"
        value={value.manufacturer}
        options={
          Array.isArray(manufacturerData?.data)
            ? manufacturerData?.data?.map((manufacturer) => ({
                label: manufacturer.Name,
                value: manufacturer.Id,
              }))
            : []
        }
        onChange={handleManufacturerFilter}
      />
      <FilterSearch
        onChange={(e) => handleSearchFilter(e.target.value)}
        value={value.search}
        placeholder="Search By Account"
        minWidth="144px"
      />
      <button
        className="border px-2.5 py-1 leading-tight"
        onClick={resetFilter}
      >
        CLEAR ALL
      </button>
    </>
  );
};

export default Filters;
