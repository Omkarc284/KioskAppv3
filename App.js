import { createAppContainer,  createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import InventoryScreen from "./src/screens/InventoryScreen"
import SaleScreen from "./src/screens/SaleScreen";
import DashboardScreen from "./src/screens/DashboardScreen"
import AddInventory from "./src/screens/AddInventory";
import AddSale from "./src/screens/AddSale";
import RatingScreen from "./src/screens/Review";
import { Provider as AuthProvider } from './src/context/AuthContext';
import { setNavigator } from "./src/navigationRef";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";
// const [kioskName, setKioskName] = useState('');
// const [isLoggedIn, setIsLoggedIn] = useState(false);

const navigator = createSwitchNavigator(
  {
    ResolveAuth : ResolveAuthScreen,
    loginFlow: createStackNavigator({
      Login: LoginScreen,
    }),
    mainFlow: createStackNavigator({
      Home: HomeScreen,
      Inventory: InventoryScreen,
      Sale: SaleScreen,
      Dashboard: DashboardScreen,
      'Add Inventory': AddInventory,
      'Create Sale': AddSale,
      Ratings: RatingScreen
    })
    
  },
  // {
  //   initialRouteName: "Login",
    
  // }
);

const App = createAppContainer(navigator);

export default () => {
  return (
    <AuthProvider>
      <App ref={(navigator) => {setNavigator(navigator)}} />
    </AuthProvider>
  )
}