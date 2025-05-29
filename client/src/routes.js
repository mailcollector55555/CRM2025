import { Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ManagerList from './pages/managers/ManagerList';
import ManagerForm from './pages/managers/ManagerForm';
import CompanyList from './pages/companies/CompanyList';
import CompanyForm from './pages/companies/CompanyForm';
import BankAccountList from './pages/bank-accounts/BankAccountList';
import BankAccountForm from './pages/bank-accounts/BankAccountForm';

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to="/managers" /> },
      { path: '/managers', element: <ManagerList /> },
      { path: '/managers/new', element: <ManagerForm /> },
      { path: '/managers/:id', element: <ManagerForm /> },
      { path: '/managers/:id/edit', element: <ManagerForm /> },
      { path: '/companies', element: <CompanyList /> },
      { path: '/companies/new', element: <CompanyForm /> },
      { path: '/companies/:id', element: <CompanyForm /> },
      { path: '/companies/:id/edit', element: <CompanyForm /> },
      { path: '/bank-accounts', element: <BankAccountList /> },
      { path: '/bank-accounts/new', element: <BankAccountForm /> },
      { path: '/bank-accounts/:id', element: <BankAccountForm /> },
      { path: '/bank-accounts/:id/edit', element: <BankAccountForm /> }
    ]
  }
];

export default routes;
