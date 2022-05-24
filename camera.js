import * as React from 'react';
import {View, Button, Image,Platform,Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'

export default class PickImage extends React.Component{
    state ={
        image:null
    }
render(){
    let {image} = this.state
    return(
        <View style={{felx:1,alignItems:'center',justifyContent:'center'}}>
         <Button title = "Pick an Image from Camera Roll"
         onPress = {this.pickImage}
         />
         
        </View>
      )   
}

componentDidMount(){
    this.getPermissionsAsync()
}

getPermissionsAsync = async()=>{
    if(Platform.OS !== 'web'){
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(status !== 'granted'){
            alert('Sorry, we need camera roll permissions to make this work.')
        }
    }
}
uploadImage = async(uri) =>{
    const data = new FormData();
    let filename = uri.split('/')[uri.split('/').length -1]
    let type = `image/${uri.split('.')[uri.split('.').length -1]}`
    const fileToUpload={
        uri : uri,
        name : filename,
        type: type,
    }
    data.append("alphabet", fileToUpload)
    fetch("http://127.0.0.1:4040",{
        method:'POST',
        body:data,
        headers:{
            'content-type':"multipart/from-data"
        }
    })
    .then((respose)=> respose.json())
    .then((result)=>{
        console.log('Sucess: ',result)
    })
    .catch((error)=>{
        console.log('Error: ',error)
    })
}
pickImage = async()=>{
    try{
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        });
        if(!result.cancelled){
            this.setState({image:result.data})
            this.uploadImage(result.uri)
        }
    }
    catch(E){
        console.log(E)
    }
}




}
