import React, { useContext, useState, useEffect, useRef } from "react";
import { Text, StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Context as AuthContext } from "../context/AuthContext";
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons'; 
import * as FaceDetector from 'expo-face-detector';
import faceApi from "../api/face";


const FaceLogin = props => {
    const { state, login, clearErrorMessage } = useContext(AuthContext)
    const [errorMessage, setErrorMessage] = useState(null)
    const [imageUri, setImageUri] = useState(null);
    const [camBorderColor, setCamBorderColor] = useState('#000F4D');
    const cameraRef = useRef()
    const [hasPermission, setHasPermission] = useState();
    const [faceData, setFaceData] = useState([]);
    
    
    useEffect(()=>{
        (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted")
        })();
    }, []);

    if (hasPermission === false){
        return <Text>No access to Camera</Text>
    }
    const takepicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.7, base64: true };
            const data = await cameraRef.current.takePictureAsync(options);
            const source = data.base64;
            
            const uri = `data:image/jpg;base64,${source}`;
            console.log(uri);
            setImageUri(data.uri);
            const result = await faceApi().post('/detect',{
                uri: uri
            })
            console.log(result)
        }
    }
    

    // function getFaceDataView() {
    //     if (faceData.length === 0) {
    //     return (
    //         <View style={styles.faces}>
    //         <Text style={styles.faceDesc}>No faces!</Text>
    //         </View>
    //     )
    //     }else {
        
    //     return faceData.map((face, index) => {
    //         const eyesShut = face.rightEyeOpenProbability < 0.4 && face.leftEyeOpenProbability < 0.4;
    //         const winking = !eyesShut && (face.rightEyeOpenProbability < 0.4 || face.leftEyeOpenProbability < 0.4);
    //         const smiling = face.smilingProbability > 0.7;
    //         return (
    //         <View>
    //             <Text style={styles.faceDesc}>Eyes Shut: {eyesShut.toString()}</Text>
    //             <Text style={styles.faceDesc}>Winking: {winking.toString()}</Text>
    //             <Text style={styles.faceDesc}>Smiling: {smiling.toString()}</Text>
    //         </View>
    //         )
    //     })
    //     }
    // }
    const handleFacesDetected = ({ faces }) => {
        
        setFaceData(faces)
        if(faces.length === 1 && faces[0].bounds.size.width >= 220){
            setErrorMessage(null)
            setCamBorderColor('green')
        }else if (faces.length === 0){
            setCamBorderColor('red')
            setErrorMessage('No Face Detected')
        }else if (faces.length === 1 && faces[0].bounds.size.width < 220) {
            setCamBorderColor('yellow')
            setErrorMessage('Move closer to the camera.\nMake sure your face is properly visible!')
        }
        else if (faces.length > 1){
            setCamBorderColor('red')
            setErrorMessage('Multiple faces detected.\nNot allowed, only single face in the frame is allowed!')
        }
    }

    return (
        <>
            <View style={[styles.cameracontainer, {borderColor: camBorderColor}]}>
        
                <Camera 
                    ref={cameraRef}
                    type={Camera.Constants.Type.front}
                    style={styles.camera}
                    onFacesDetected={handleFacesDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.FaceDetectorMode.accurate,
                        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
                        runClassifications: FaceDetector.FaceDetectorClassifications.all,
                        minDetectionInterval: 250,
                        tracking: true,
                        
                    }}
                >
                
                </Camera>
            </View>
            <View style={{justifyContent: 'center', alignItems:'center'}}>
                <Text>{errorMessage}</Text>
            </View>
            <View style={{bottom: -48}}>
                <TouchableOpacity style={styles.captureButton} onPress={takepicture} disabled={errorMessage} >
                    <Ionicons name="ios-camera" size={36} color="#000F4D" />
                </TouchableOpacity>
            {/* {getFaceDataView()} */}
            </View>
      
        </>
        
    )

};

const styles = StyleSheet.create({
    cameracontainer: {
        alignSelf: 'center',
        marginVertical: 56,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        
    },
    camera: {
        height: 400,
        width: 300,
    },
    faces:{
        background: '#ffffff',
        alignself: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 36
    },
    faceDesc: {
        fontSize: 24,
        fontWeight: '600'
    },
    captureButton: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000F4D',
        borderWidth: 2,
        borderRadius: 100,
        paddingHorizontal: 15,
        paddingVertical: 12
    }
});

export default FaceLogin;

