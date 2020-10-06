import get from "lodash/get";
import numeral from "numeral";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// ===== extend
dayjs.extend(relativeTime);

/**
 * see http://numeraljs.com/ for documentation
 */
export const formatDate = (
  data: any,
  options?: { relative: boolean; format: string }
): string => {
  const relative = get(options, "relative", false);
  const outFormat = get(options, "format", "DD-MM-YYYY");
  if (relative) {
    return dayjs(data).fromNow();
  }
  return dayjs(data).locale("ms").format(outFormat);
};

export const formatCurrency = (
  amount: string | number = 0,
  currency: string,
  format = "0,0.00"
): string | number => {
  const price = numeral(amount).format(format);
  if (currency) {
    return `${currency} ${price}`;
  }
  return price;
};

export const fortmatAddress = (data: {
  address1: string;
  address2: string;
  postalCode: string;
  city: string;
  province: string;
  state: string;
  country: string;
}): string => {
  const address1 = get(data, "address1");
  const address2 = get(data, "address2");
  const postalCode = get(data, "postalCode");
  const city = get(data, "city");
  const province = get(data, "province");
  const state = get(data, "state");
  const country = get(data, "country");

  let finalAddress = "";
  if (address1) {
    finalAddress += `${address1}, `;
  }
  if (address2) {
    finalAddress += `${address2}, `;
  }
  if (postalCode) {
    finalAddress += `${postalCode} `;
  }
  if (city) {
    finalAddress += `${city}, `;
  }
  if (province || state) {
    finalAddress += `${state || province}, `;
  }
  if (country) {
    finalAddress += `${country}.`;
  }
  return finalAddress;
};

export const spaceMatch = (character: string | null): boolean => {
  if (character === " ") {
    return true;
  }
  return false;
};

export const punctuationMatch = (idx: number, text: string): boolean => {
  const PUNCTUATION_LIST = [
    ".",
    ",",
    "!",
    "?",
    "'",
    "{",
    "}",
    "(",
    ")",
    "[",
    "]",
    "/"
  ];
  const punctuationIdx = PUNCTUATION_LIST.indexOf(text[idx]);
  if (punctuationIdx >= 0 && spaceMatch(text[idx + 1])) {
    return true;
  }
  return false;
};

export const checkMatch = (
  idx: number,
  text: string,
  max: number,
  min: number
): boolean => {
  if (idx < max && idx > min && punctuationMatch(idx, text)) {
    return true;
  }
  return false;
};

export const trimText = (
  text: string,
  min: number = 80,
  ideal: number = 100,
  max: number = 200
): (string | number)[] => {
  // This main function uses two pointers to move out from the ideal, to find the first instance of a punctuation mark followed by a space. If one cannot be found, it will go with the first space closest to the ideal.

  if (max < min || ideal > max || ideal < min) {
    throw new Error(
      "The minimum length must be less than the maximum, and the ideal must be between the minimum and maximum."
    );
  }

  if (text.length < ideal) {
    return [text, ""];
  }

  let pointerOne = ideal;
  let pointerTwo = ideal;
  let firstSpace;
  let resultIdx;

  const setSpace = (idx) => {
    if (spaceMatch(text[idx])) {
      firstSpace = firstSpace || idx;
    }
  };

  while (pointerOne < max || pointerTwo > min) {
    if (checkMatch(pointerOne, text, max, min)) {
      resultIdx = pointerOne + 1;
      break;
    } else if (checkMatch(pointerTwo, text, max, min)) {
      resultIdx = pointerTwo + 1;
      break;
    } else {
      setSpace(pointerOne);
      setSpace(pointerTwo);
    }

    pointerOne += pointerOne;
    pointerTwo -= pointerTwo;
  }

  if (resultIdx === undefined) {
    if (firstSpace && firstSpace >= min && firstSpace <= max) {
      resultIdx = firstSpace;
    } else if (ideal - min < max - ideal) {
      resultIdx = min;
    } else {
      resultIdx = max;
    }
  }

  return [text.slice(0, resultIdx), text.slice(resultIdx).trim()];
};

export default {
  formatDate,
  formatCurrency,
  spaceMatch,
  punctuationMatch,
  checkMatch,
  trimText
};
