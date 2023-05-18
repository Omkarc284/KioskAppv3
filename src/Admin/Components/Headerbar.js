import * as React from 'react';
import { Image, View } from 'react-native';
import Modal from "react-native-modal"
import { Appbar, Drawer } from 'react-native-paper';
import colors from '../utils/colors';
import { Context as AuthContext } from "../../Keeper/context/AuthContext";

const HeaderBar = ({navigation}) => {
    const { state, adminlogout, clearErrorMessage } = React.useContext(AuthContext)
    const [visible,setVisible] = React.useState(false)
    const [active, setActive] = React.useState('first');
    // React.useEffect(()=>{

    // },[navigation.state.routeName])
    return (
        <>
            <Appbar.Header style={{backgroundColor: colors.navy, height: 72}}>
            
                <Image style={{zIndex:2, margin: 16, height: 32, width: 23}}  source={require('../../../assets/image1.png')} />
                <Appbar.Content color={colors.white} title="Kiosk Manager" />
                
                <Appbar.Action icon="account-circle" color={colors.white} size={36} onPress={() => {setVisible(!visible)}} />

            </Appbar.Header>
            
                    <Modal
                        animationIn='fadeIn'
                        animationOut='fadeOut'
                        onDismiss={()=>{setVisible(false)}}
                        isVisible={visible}
                        onBackdropPress={()=>{setVisible(false)}}
                        onBackButtonPress={() => {setVisible(false)}}
                        backdropOpacity={0.3}
                        style={{paddingVertical:18,position: 'absolute', backgroundColor: 'white', alignSelf: 'flex-end', elevation: 15, zIndex:10, marginTop: 72,marginRight: 36, width: 216, borderRadius: 24}}
                    >
                        <View  >
                            <Drawer.Section showDivider={false} >
                                <Drawer.Item
                                    icon="home"
                                    label="Home"
                                    active={active === 'first'}
                                    onPress={() => {setActive('first'); navigation.navigate('HomeAdmin'); setVisible(false)}}
                                />
                                <Drawer.Item
                                    icon="cog"
                                    label="Settings"
                                    active={active === 'second'}
                                    onPress={() => {setActive('second'), setVisible(false)}}
                                />
                                <Drawer.Item
                                    icon="logout"
                                    label="Logout"
                                    onPress={ async () => {await adminlogout()}}
                                />
                            </Drawer.Section>
                        </View>
                        
                    </Modal>
                    
                
            
            
        </>
        
    )
};

export default HeaderBar;