import axios from "axios";

export const getUSDCurrency = async () => {
  const response = await axios.get(
    "https://cbu.uz/uz/arkhiv-kursov-valyut/json/USD/"
  );
  return response.data;
};
