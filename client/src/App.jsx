import React from 'react'
import { Route,Routes,BrowserRouter } from 'react-router-dom';
import  {CampaignDetails,CreateCampaign,Home,Profile,Cancelled, CustomCampaigns,InvestedCampaigns} from './pages'
import {Sidebar,Navbar} from './components'
const App = () => {
  //const [searchAddress, setsearchAddress] = useState('');
  return (
      <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
      
        <div className="hidden sm:flex  mr-10 relative">
          <Sidebar/>
        </div>
        <div className='flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5'>
        <Navbar/>
          <Routes>
          
            <Route path='/' element={<Home/>} />
            <Route path='/profile' element={<Profile/>} />
            <Route path='/create-campaign' element={<CreateCampaign/>} />
            <Route path='/campaign-details/:id' element={<CampaignDetails/>} />
            <Route path='/cancelled' element={<Cancelled/>} />
            <Route path='/customCampaigns/:search' element={<CustomCampaigns/>} />
            <Route path='/InvestedCampaigns' element={<InvestedCampaigns/>} />
          </Routes>
        </div>
      </div>
  )
}

export default App;
