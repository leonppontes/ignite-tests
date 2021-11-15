export default {
  jwt: {
    secret: `${process.env.JWT_SECRET}`,
    //secret: 'senhasupersecreta123',
    expiresIn: '1d'
  }
}
