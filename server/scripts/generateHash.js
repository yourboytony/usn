import bcrypt from 'bcrypt'

const password = 'Tonyplayz2023$'
const saltRounds = 10

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('Password:', password)
  console.log('Hashed password:', hash)
}) 