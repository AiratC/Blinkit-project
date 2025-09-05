const forgotPasswordTemplate = ({ name, otp }) => {
   return `
   <div>
      <p>Дорог-ой/ая ${name}</p>
      <p>Пожалуйста используйте OTP Код для сбросса пароля</p>
      <div style="background: yellow; padding: 30px; font-size: 20px; text-align: center; font-weight: 800;">
         ${otp}
      </div>
      <p>Данный код действителен только 1 час</p>
      <p>Спасибо!😊</p>
      <p>Fashion-shop</p>
   </div>
   `
};


export default forgotPasswordTemplate;