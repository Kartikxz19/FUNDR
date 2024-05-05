import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ChainId,ThirdwebProvider } from '@thirdweb-dev/react';
import App from './App';
import './index.css';
import { StateContextProvider } from './context';
import { sepolia } from "thirdweb/chains";

const root=ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ThirdwebProvider clientId='8ae1697ceb09f24c8ada8ed1923a7848' activeChain="sepolia" >
    <BrowserRouter>
        <StateContextProvider>
            <App/>
        </StateContextProvider>
    </BrowserRouter>
    </ThirdwebProvider>
)