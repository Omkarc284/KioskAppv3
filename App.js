import { createAppContainer,  createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import MyMap from './src/Keeper/screens/location';
import HomeScreenKeeper from "./src/Keeper/screens/HomeScreen";
import LoginScreenKeeper from "./src/Keeper/screens/LoginScreen";
import InventoryScreen from "./src/Keeper/screens/InventoryScreen"
import SaleScreen from "./src/Keeper/screens/SaleScreen";
import DashboardScreenKeeper from "./src/Keeper/screens/DashboardScreen"
import AddInventory from "./src/Keeper/screens/AddInventory";
import AddSale from "./src/Keeper/screens/AddSale";
import RatingScreen from "./src/Keeper/screens/Review";
import { Provider as AuthProvider } from './src/Keeper/context/AuthContext';
import { setNavigator } from "./src/navigationRef";
import ResolveAuthScreenKeeper from "./src/Keeper/screens/ResolveAuthScreen";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from "react";
import { Alert, BackHandler } from "react-native";
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import * as Network from 'expo-network';
import LoginScreenAdmin from "./src/Admin/screens/LoginScreen";
import HomeScreenAdmin from "./src/Admin/screens/HomeScreen";
import DashboardScreenAdmin from "./src/Admin/screens/Dashboard/DashboardScreen";
import ProductScreen from "./src/Admin/screens/Product/ProductScreen";
import ProductDetails from "./src/Admin/screens/Product/ProductDetails";
import AddProduct from "./src/Admin/screens/Product/AddProduct";
import KioskScreen from "./src/Admin/screens/Kiosk/KioskScreen";
import KioskDetails from "./src/Admin/screens/Kiosk/KioskDetails";
import AddKiosk from "./src/Admin/screens/Kiosk/AddKiosk";
import Inventory from "./src/Admin/screens/Dashboard/Inventory/Inventory";
import Collection from "./src/Admin/screens/Dashboard/Collection/Collection";
import Attendance from "./src/Admin/screens/Dashboard/Attendance/Attendance";
import SalesScreen from "./src/Admin/screens/Sales/SaleScreen";
import AddSales from "./src/Admin/screens/Sales/AddSales";
import EditSale from "./src/Admin/screens/Sales/EditSale";
import EditInventories from "./src/Admin/screens/Dashboard/Inventory/EditInventories";


SplashScreen.preventAutoHideAsync();

const navigator = createSwitchNavigator(
  {
    
    // KeeperFlow: createStackNavigator({
      
    // },{navigationOptions:{headerShown: false}}),
    ResolveAuth :  ResolveAuthScreenKeeper,
    loginFlow: createStackNavigator({
      Welcome: {
        screen: MyMap,
        navigationOptions: {
          headerShown: false
        }
      },
      
      // Authenticate: FaceLogin,
      Login: {
        screen: LoginScreenKeeper,
        navigationOptions: {
          headerShown: false
        }
      },
      LoginAdmin: {
        screen: LoginScreenAdmin, 
        navigationOptions: {
          headerShown: false,
        },
      },
    },{navigationOptions:{headerShown: false}}),
    KeeperFlow: createStackNavigator({
      Home: HomeScreenKeeper,
      Inventory: InventoryScreen,
      Sale: SaleScreen,
      Dashboard: DashboardScreenKeeper,
      'Add Inventory': AddInventory,
      'Create Sale': AddSale,
      Ratings: RatingScreen
    }, {navigationOptions:{headerShown: false,headerLeft: ()=> null}}),
    AdminFlow: createStackNavigator({
      HomeAdmin: {
        screen: HomeScreenAdmin,
        navigationOptions: {
          headerShown: false
        }
      },
      DashboardFlow: createStackNavigator({
        DashboardAdmin:{
          screen: DashboardScreenAdmin,
          navigationOptions: {
            headerShown: false
          }
        },
        InventoryFlow: createStackNavigator({
          InventoryAdmin: {
            screen: Inventory,
            navigationOptions: {
              headerShown: false
            }
          },
          EditInventory:{
            screen: EditInventories,
            navigationOptions: {
              headerShown: false
            }
          }
        }, {navigationOptions: {headerShown: false}}),
        CollectionAdmin: {
          screen: Collection,
          navigationOptions: {
            headerShown: false
          }
        },
        AttendanceAdmin:{
          screen: Attendance,
          navigationOptions:{
            headerShown: false
          }
        }
      }, {navigationOptions: {headerShown: false}}),
      ProductFlow:createStackNavigator({
        Product:{
          screen:  ProductScreen,
          navigationOptions: {
            headerShown: false
          }
        },
        ProductDetails:{
          screen:  ProductDetails,
          navigationOptions: {
            headerShown: false
          }
        },
        AddProduct:{
          screen:  AddProduct,
          navigationOptions: {
            headerShown: false
          }
        }
      }, {navigationOptions: {headerShown: false}}),
      KioskFlow:createStackNavigator({
        Kiosk:{
          screen:  KioskScreen,
          navigationOptions: {
            headerShown: false
          }
        },
        KioskDetails:{
          screen:  KioskDetails,
          navigationOptions: {
            headerShown: false
          }
        },
        AddKiosk:{
          screen:  AddKiosk,
          navigationOptions: {
            headerShown: false
          }
        }
      }, {navigationOptions: {headerShown: false}}),
      SalesFlow:createStackNavigator({
        Sales:{
          screen:  SalesScreen,
          navigationOptions: {
            headerShown: false
          }
        },
        SaleDetails:{
          screen:  EditSale,
          navigationOptions: {
            headerShown: false
          }
        },
        AddSales:{
          screen:  AddSales,
          navigationOptions: {
            headerShown: false
          }
        }
      }, {navigationOptions: {headerShown: false}}),
      
    }, {navigationOptions:{headerShown: false}})
  },
);

const App = createAppContainer(navigator);

export default () => {
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    async function prepare() {
      try {
        
        const network = await Network.getNetworkStateAsync();
        console.log(network)
        if(!network.isInternetReachable){
          Alert.alert('No internet!', 'Make sure you are connected to internet and try again',[{
            text: 'Exit',
            onPress: () => BackHandler.exitApp()
          }])
        }
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        setTimeout(() => {}, 2000);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);
  return (
    <AuthProvider>
      <App ref={(navigator) => {setNavigator(navigator)}} />
    </AuthProvider>
  )
}