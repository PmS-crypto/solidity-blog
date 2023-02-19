import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import ListItem from '../components/ListItem'
import Post from '../components/Post'
import Navbar from '../components/Navbar'
import Survey from '../components/Survey'
import SideBar from '../components/Sidebar'
import { Listing } from '../data/Listing.seed'
import { Posts } from '../data/Post.seed'
import ConnectContainer from '../components/ConnectContainer'
import { SurveySeed } from '../data/Survey.seed'
import Modal from 'react-modal'
import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import CreatePostModal from '../components/CreatePostModal'
import { useAppContext } from '../context/context'
import { mainnet, optimism, polygonMumbai } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

// import ReactDOM from 'react-dom';



Modal.setAppElement('#__next')

// const { chains, provider } = configureChains([polygonMumbai], [alchemyProvider({ apiKey: process.env.PRIVATE_KEY, priority: 1 })]);
const { chains, provider } = configureChains(
  [chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: 'VRUMs3WJcJAMuWi9nCZ8rIpkgR9BYhy_' }),
    publicProvider(),
  ]
)

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#F5F5F5',
    padding: 0,
    border: 'none',
  },
  overlay: {
    backgroundColor: 'rgba(10, 11, 13, 0.75)',
  },
}

const Home = () => {
  const router = useRouter()
  const { posts } = useAppContext()

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div className='main-container '>
          <Head>
            <title>Dev.to</title>
            <meta name='description' content='Generated by create next app' />
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <Navbar />
          <div className='app-container'>
            <div className='main-header'>
              <div className='main-avatar-wrap'>
                <Image
                  className='avatar avatar--medium'
                  src='https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg'
                  alt='Avatar'
                  layout='fill'
                />
              </div>
              <h1 className='text-weight-semibold tab'>Relevant</h1>
              <span className='text-tab text-weight-medium pr-20  grey-tab tab'>
                Latest
              </span>
              <span className='text-tab text-weight-medium pr-20 grey-tab tab'>
                Top
              </span>
              <div className='flex-1' />
              <span className='text-tab text-weight-medium pr-20 grey-tab tab'>
                <Link href='/?post=1'>
                  <span>Create Post</span>
                </Link>
              </span>
            </div>
            <aside className='main-nav-wrap'>
              <nav className='main-nav-extended'>
                <div className='main-nav-section'>
                  <ConnectContainer />
                  <SideBar />
                  {SurveySeed.map((item) => {
                    return <Survey key={item.src} {...item} />
                  })}
                </div>
              </nav>
            </aside>
            <main className='main-content'>
              {Posts.map((item, index) => {
                return <Post {...item} key={index} />
              })}
            </main>
            <aside className='main-aside'>
              <Survey
                src={
                  'https://res.cloudinary.com/practicaldev/image/fetch/s--ff2NVgR1--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_350/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ekb1fyzsp9jx2uxdnrqt.png'
                }
              />
              {Listing.map((item, index) => {
                return (
                  <article className='trends mb-10' key={index}>
                    <header className='trends-header'>
                      <h2 className='text-bold'>{item.name}</h2>
                      {item.seeAll && (
                        <div className='trend-more text-large'>See All</div>
                      )}
                    </header>
                    <section className='trends-content'>
                      {item?.data?.map((data) => {
                        return <ListItem {...data} key={data.title} />
                      })}
                    </section>
                  </article>
                )
              })}
            </aside>
          </div>
        </div>
        <Modal
          isOpen={!!router.query.post}
          onRequestClose={() => router.push('/')}
          style={customStyles}
        >
          <CreatePostModal />
        </Modal>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default Home
