import { faker } from '@faker-js/faker'

export type NewUser = {
  name: string
  email: string
  password: string
  firstName: string
  lastName: string
  address: string
  state: string
  city: string
  zipcode: string
  mobile: string
}

export function generateUser(): NewUser {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    // timestamp keeps the email unique on every run
    email: `${firstName}.${lastName}.${Date.now()}@example.com`.toLowerCase(),
    password: faker.internet.password({ length: 12 }),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.location.zipCode(),
    mobile: faker.string.numeric(10),
  }
}

