import { CreateUserUseCase } from '../src/modules/users/useCases/CreateUser/CreateUserUseCase';
import prisma from '../src/prisma/mockClient';
import { expect, test, vi, describe,it,afterAll } from 'vitest' // 👈🏻 Added the `vi` import

afterAll(() => {
    vi.restoreAllMocks()
})

vi.mock("../src/prisma/client")

describe('Create user spec', () => {

    it('Should throw if account exist', async () => {

        const emailFixture = ()=>{
            return Math.random().toString(36).substring(7)+'@gmail.com'
        }
        const email = emailFixture()
        
        prisma.user.findUnique.mockResolvedValueOnce({
            email,
            id: "uuid",
            name: 'SomeName',
            password: 'someHash'
        })

        const userUseCase = new CreateUserUseCase();

        expect(await userUseCase.execute({
            name: 'rafa@gmail.com',
            email,
            password: ''
        })).toThrowError('User already exists')
        
    })

    it('Should create otherwise', async () => {

        const emailFixture = ()=>{
            return Math.random().toString(36).substring(7)+'@gmail.com'
        }
        const email = emailFixture()
        
        prisma.user.findUnique.mockResolvedValueOnce({
            email,
            id: "uuid",
            name: 'SomeName',
            password: 'someHash'
        })

        const userUseCase = new CreateUserUseCase();


        await userUseCase.execute({
            name: 'rafa@gmail.com',
            email: email+"1",
            password: ''
        })
        expect(prisma.user.create).toHaveBeenCalled()
        
    })

})