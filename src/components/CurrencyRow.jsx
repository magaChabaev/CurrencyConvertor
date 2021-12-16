import React from "react";
import "./CurrencyRow.scss";

const CurrencyRow = ({
  onChangeCurrency,
  selectedCurrency,
  currencyNames,
  amount,
  onAmountChange,
}) => {
  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={onAmountChange}
        className="input"
      ></input>
      <select
        value={selectedCurrency}
        onChange={onChangeCurrency}
        className="select"
      >
        {currencyNames.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencyRow;
