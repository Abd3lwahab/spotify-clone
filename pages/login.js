import { getProviders, signIn } from 'next-auth/react'

import logo from '../assets/logo.png'

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img className="w-52 mb-5" src={logo.src} alt="" />
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button
            className="bg-[#1ed760] text-black font-medium py-3 px-8 rounded-lg hover:text-white"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: '/',
              })
            }
          >
            Login with {provider.name}
          </button>
        </div>
      ))}
    </div>
  )
}

export default Login

export async function getServerSideProps() {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
