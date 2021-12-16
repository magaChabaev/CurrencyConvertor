import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import CurrencyRow from "./components/CurrencyRow";
import "./App.scss";

const URL = `https://api.fastforex.io/fetch-all?from=RUB&api_key=${process.env.REACT_APP_CURRENCY_CONVERTOR_API_KEY}`;

const App = () => {
  const [currencyNames, setCurrencyNames] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("RUB");
  const [toCurrency, setToCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [whichConvert, setWhichConvert] = useState("first");
  const [showModal, setShowModal] = useState(false);

  let toAmount, fromAmount;
  if (whichConvert === "first") {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    axios.get(`${URL}`).then((response) => {
      setCurrencyNames(
        Object.keys(response.data.results).filter(
          (name) => name === "USD" || name === "EUR" || name === "RUB"
        )
      );
      setExchangeRate(response.data.results["USD"]);
    });
    setInterval(
      () =>
        axios.get(`${URL}`).then((response) => {
          setExchangeRate(response.data.results["USD"]);
        }),
      15000
    );
  }, []);

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      axios
        .get(
          `https://api.fastforex.io/fetch-one?from=${fromCurrency}&to=${toCurrency}&api_key=b621f45c91-2baace9ccb-r45sqo`
        )
        .then((response) => setExchangeRate(response.data.result[toCurrency]));
      setInterval(
        () =>
          axios
            .get(
              `https://api.fastforex.io/fetch-one?from=${fromCurrency}&to=${toCurrency}&api_key=b621f45c91-2baace9ccb-r45sqo`
            )
            .then((response) =>
              setExchangeRate(response.data.result[toCurrency])
            ),
        15000
      );
    }
  }, [toCurrency, fromCurrency]);

  const handleFromAmountChange = (e) => {
    if (e.target.value < 0) {
      alert("Enter a valid number");
      setAmount(0);
      return;
    }
    setAmount(e.target.value);
    setWhichConvert("first");
  };

  const onChangeToCurrency = (e) => {
    if (e.target.value === fromCurrency) return;
    setToCurrency(e.target.value);
  };

  const onChangeFromCurrency = (e) => {
    if (e.target.value === toCurrency) return;
    setFromCurrency(e.target.value);
  };

  const handleToAmountChange = (e) => {
    if (e.target.value < 0) {
      alert("Enter a valid number");
      setAmount(0);
      return;
    }
    setAmount(e.target.value);
    setWhichConvert("second");
  };

  const reverse = () => {
    let temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <>
      <div className="main">
        <button className="button" onClick={() => setShowModal(true)}>
          Currency Convertor
        </button>
        {showModal ? (
          <div className="modal" onClick={() => setShowModal(false)}>
            <div
              className="modal__content"
              onClick={(e) => e.stopPropagation()}
            >
              <CurrencyRow
                currencyNames={currencyNames}
                selectedCurrency={fromCurrency}
                onChangeCurrency={onChangeFromCurrency}
                amount={fromAmount}
                onAmountChange={handleFromAmountChange}
              />
              <i class="material-icons icon" onClick={() => reverse()}>
                swap_horiz
              </i>
              <CurrencyRow
                currencyNames={currencyNames}
                selectedCurrency={toCurrency}
                onChangeCurrency={onChangeToCurrency}
                amount={toAmount}
                onAmountChange={handleToAmountChange}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default App;
