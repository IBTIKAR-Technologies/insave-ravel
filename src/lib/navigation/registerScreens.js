import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import Login from 'src/containers/Login';
import DataLoader from 'src/containers/DataLoader';
import Home from 'src/components/Home';
import UnitesLiees from 'src/components/UnitesLiees';
import HistoryCiblage from 'src/containers/HistoryCiblage';
import User from 'src/components/User';
import Users from 'src/components/Users';
import AddUser from 'src/components/AddUser';
import SubUsers from 'src/components/SubActs';
import WrappedComponent from './WrappedComponent';

export const screens = [
  { name: 'User', component: User },
  { name: 'UnitesLiees', component: UnitesLiees },
  { name: 'Users', component: Users },
  { name: 'Home', component: Home },
  { name: 'HistoryCiblage', component: HistoryCiblage },
  { name: 'Login', component: Login },
  { name: 'DataLoader', component: DataLoader },
  { name: 'AddUser', component: AddUser },
  { name: 'SubUsers', component: SubUsers },
];

const registerScreens = () => {
  screens.forEach(screen => {
    Navigation.registerComponent(
      screen.name,
      () => gestureHandlerRootHOC(WrappedComponent(screen.component)),
      () => screen.component,
    );
  });
};

export default registerScreens;
