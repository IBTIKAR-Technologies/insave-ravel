import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { Navigation } from 'react-native-navigation';
import Details from 'src/containers/Details';
import History from 'src/containers/History';
import Login from 'src/containers/Login';
import DataLoader from 'src/containers/DataLoader';
import Ciblage from 'src/components/Ciblage';
import Home from 'src/components/Home';
import HistoryCiblage from 'src/containers/HistoryCiblage';
import AddConcession from 'src/components/AddConcession';
import MenagesSelected from 'src/components/MenagesSelected';
import UrbainOrRural from 'src/components/UrbainOrRural';
import Zones from 'src/components/Zones';
import EditZone from 'src/components/EditZone';
import QuestionaireLocalite from 'src/components/QuestionaireLocalite';
import Enquete from 'src/components/Enquete';
import Concessions from 'src/components/Concessions';
import AddMenage from 'src/components/AddMenage';
import User from 'src/components/User';
import GeneralInfoModal from 'src/components/GeneralInfoModal';
import ZonesInfoModal from 'src/components/ZonesInfoModal';
import FinalSelection from 'src/containers/FinalSelection';
import ConfirmSages from 'src/components/ConfirmSages';
import AddEnquete from 'src/components/AddEnquete';
import HistoryEnquete from 'src/components/HistoryEnquete';
import EnqueteTimer from 'src/components/EnqueteTimer';
import AddMembre from 'src/components/AddMembre';
import MenageMembres from 'src/components/MenageMembres';
import Localites from 'src/components/Localites';
import EditMenagePhoneNNI from 'src/components/EditMenagePhoneNNI';
import AddLocalite from 'src/components/AddLocalite';
import LocalitesToValidate from 'src/components/LocalitesToValidate';
import DiviseLocalite from 'src/components/DiviseLocalite';
import AddZone from 'src/components/AddZone';
import AddInfraction from 'src/components/AddInfraction';
import ListRouge from 'src/components/ListRouge';

import SeeQuotasLocalites from 'src/components/SeeQuotasLocalites';
import LocaliteIdentification from 'src/components/LocaliteIdentification';
import LocaliteInfras from 'src/components/LocaliteInfras';
import LocaliteSages from 'src/components/LocaliteSages';
import AddSage from 'src/components/AddSage';
import ResetSelectedZone from 'src/components/ResetZoneSelection';
import CorrectMenages from 'src/components/CorrectMenages';
import CorrectMenage from 'src/components/CorrectMenage';
import Identifications from 'src/components/Identifications';
import EditMenageSuper from 'src/components/EditMenageSuper';
import Users from 'src/components/Users';
import AddUser from 'src/components/AddUser';
import SubUsers from 'src/components/SubActs';
import WrappedComponent from './WrappedComponent';

export const screens = [
  { name: 'User', component: User },
  { name: 'Users', component: Users },
  { name: 'Home', component: Home },
  { name: 'Ciblage', component: Ciblage },
  { name: 'HistoryCiblage', component: HistoryCiblage },
  { name: 'HistoryEnquete', component: HistoryEnquete },
  { name: 'Details', component: Details },
  { name: 'History', component: History },
  { name: 'AddConcession', component: AddConcession },
  { name: 'AddMenage', component: AddMenage },
  { name: 'Login', component: Login },
  { name: 'DataLoader', component: DataLoader },
  { name: 'UrbainOrRural', component: UrbainOrRural },
  { name: 'Zones', component: Zones },
  { name: 'EditZone', component: EditZone },
  { name: 'QuestionaireLocalite', component: QuestionaireLocalite },
  { name: 'Enquete', component: Enquete },
  { name: 'Concessions', component: Concessions },
  { name: 'GeneralInfoModal', component: GeneralInfoModal },
  { name: 'ZonesInfoModal', component: ZonesInfoModal },
  { name: 'FinalSelection', component: FinalSelection },
  { name: 'ConfirmSages', component: ConfirmSages },
  { name: 'MenagesSelected', component: MenagesSelected },
  { name: 'AddEnquete', component: AddEnquete },
  { name: 'MenageMembres', component: MenageMembres },
  { name: 'EnqueteTimer', component: EnqueteTimer },
  { name: 'AddMembre', component: AddMembre },
  { name: 'Localites', component: Localites },
  { name: 'AddLocalite', component: AddLocalite },
  { name: 'LocalitesToValidate', component: LocalitesToValidate },
  { name: 'EditMenagePhoneNNI', component: EditMenagePhoneNNI },
  { name: 'DiviseLocalite', component: DiviseLocalite },
  { name: 'AddZone', component: AddZone },
  { name: 'SeeQuotasLocalites', component: SeeQuotasLocalites },
  { name: 'LocaliteIdentification', component: LocaliteIdentification },
  { name: 'LocaliteInfras', component: LocaliteInfras },
  { name: 'LocaliteSages', component: LocaliteSages },
  { name: 'AddSage', component: AddSage },
  { name: 'ResetSelectedZone', component: ResetSelectedZone },
  { name: 'CorrectMenages', component: CorrectMenages },
  { name: 'CorrectMenage', component: CorrectMenage },
  { name: 'EditMenageSuper', component: EditMenageSuper },
  { name: 'AddInfraction', component: AddInfraction },
  { name: 'ListRouge', component: ListRouge },
  { name: 'Identifications', component: Identifications },
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
