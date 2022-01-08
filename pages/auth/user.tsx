import { signIn, signOut, useSession } from 'next-auth/react'
import { startRegistration } from '@simplewebauthn/browser'
import tw from 'twin.macro'
import axios from 'axios'

export default function Home() {
  const { data: session, status } = useSession({
    required: true, onUnauthenticated() {
      return signIn()
    }
  })

  async function registerWebauthn(platform?: boolean) {
    const optionsResponse = await axios.get('/api/auth/webauthn/register', { params: { platform: platform } })
    if (optionsResponse.status !== 200) {
      alert('Could not get registration options from server')
      return
    }
    const opt = await optionsResponse.data

    try {
      const credential = await startRegistration(opt)

      const response = await fetch('/api/auth/webauthn/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credential),
        credentials: 'include'
      })
      if (response.status != 201) {
        alert('Could not register webauthn credentials.')
      } else {
        alert('Your webauthn credentials have been registered.')
      }
    } catch (err) {
      alert(`Registration failed. ${(err as Error).message}`)
      // err.name === 'InvalidStateError' when credential has already been registered
    }

  }

  if (status === 'authenticated') {
    return (
      <div>
        <main>
          <h1>
            Welcome to <a href="https://webauthn.guide/" target="_blank" rel="noopener noreferrer">Webauthn</a> Demo
          </h1>
          <button onClick={() => registerWebauthn()} css={tw`bg-gray-200`}>Register cross-platform Webauthn</button>
          <button onClick={() => registerWebauthn(true)} css={tw`bg-gray-200`}>Register platform Webauthn</button>

          <span>Signed in as {session?.user?.email}</span>
          <button onClick={() => signOut()} css={tw`bg-gray-200`}>Log out</button>
        </main>
      </div>
    )
  }
  return <div>Loading...</div>;
}
