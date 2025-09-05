const verifyEmailTemplate = ({ name, url }) => {
   return `
   <p>Дорогой ${name}</p>
   <p>Спасибо за регистрацию Fashion-Shop</p>
   <a href=${url} style="color: black; background: orange; margin-top: 40px; padding: 20px; display: block">
      Подтвердите адрес электронной почты
   </a>
   `
}

export default verifyEmailTemplate;