const generatedOtp = () => {
   return Math.floor(Math.random() * 900000) + 100000 // От 100000 до 999999
};

export default generatedOtp;