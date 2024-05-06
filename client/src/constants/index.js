import { createCampaign, dashboard, logout, payment, profile, withdraw,cross,invested } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'cancelled',
    imgUrl: cross,
    link: '/cancelled',
    disabled: false,
  },
  /* {
    name: 'invested',
    imgUrl: invested,
    link: '/InvestedCampaigns',
    disabled: false,
  }, */
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
    disabled: true,
  },
];