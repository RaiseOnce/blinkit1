const verifyEmailTemplate = ({ name, url }) => {
  return `<p>Dear ${name}</p>
          <p>Thank you for registering Blinkit.</p>
          <a href=${url} style='display:block; color:black; background-color: orange; margin-top: 10px; padding: 20px;'>Verify Email</a>`
}

export default verifyEmailTemplate
