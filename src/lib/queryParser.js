import currencies from '../data/currencies.js';
import localeCurrencyData from '../data/locale-data.js';

function isNumber(item) {
  return !isNaN(parseInt(item, 10));
}

module.exports = function(queryString, locale) {
  queryString = queryString || {};
  var presets = queryString.presets || "";
  var queryStringCurrencyCode = queryString.currency;
  var localeCurrencyCode = localeCurrencyData[locale];
  var amount = "";
  var frequency = "single";
  var test = queryString.test;
  var currency = currencies[queryStringCurrencyCode] || currencies[localeCurrencyCode] || currencies.usd;

  if (queryString.amount && !isNaN(queryString.amount)) {
    amount = queryString.amount.trim();
  }
  if (queryString.frequency === "monthly") {
    frequency = "monthly";
  }

  // We didn't get valid presets from the query string,
  // so default to the currency and frequency preset.
  presets = presets.split(",");
  if (presets.length !== 4 || !presets.every(isNumber)) {
    presets = currency.presets[frequency];
  }

  // Collaps test to a string if it happens to be an array.
  if (test && test.join) {
    test = test.join(" ");
  }

  var parsed = {
    values: {
      test: test,
      subscribed: queryString.subscribed
    },
    initialState: {
      currency: currency,
      presets: presets,
      amount: amount,
      frequency: frequency,
      email: queryString.email || ""
    }
  };

  return parsed;
};
