
'use server'

import { sigInWithPassword } from "@/http/sign-in-with-password"

export async function  signInWithEmailAndPassword(previousState:unknown, data: FormData){
    console.log(previousState)
    const {email, password} = Object.fromEntries(data)

    const result = await sigInWithPassword({
        email: String(email),
        password:String(password),
    })

    console.log(result)

    return 'Sucesso!!!'
}