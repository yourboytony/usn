import { compare, hash } from 'bcryptjs'

export async function verifyPassword(password, hash) {
  return await compare(password, hash)
}

export async function hashPassword(password) {
  return await hash(password, 10)
} 