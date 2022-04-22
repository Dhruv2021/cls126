import * as React from "react";
import { Button, Image, View, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

export default class Pickmage extends React.Component {
state={
    image:null
}
render(){
    return(
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
            <Button title="Pick An Image" onPress={this.pickImage}/>
        </View>
    )
}
componentDidMount(){
    this.getPermissions()
}
getPermissions=async ()=>{
    if(Platform.OS!=="web"){
        const {status}=await Permissions.askAsync(Permissions.CAMERA_ROLL)
     if (status!=="granted"){
            alert("Sorry We Need Camera Roll Permissions To Make This Work")
        }
    }
}
pickImage=async ()=>{
    try {
        let result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if (!result.cancelled){
            this.setState({image:result.data})
            this.uploadImage(result.uri)
        }
    }

    catch (E){
        console.log(E)
    }
}
uploadImage=async (uri)=>{
    const data=new FormData()
    let filename = uri.split("/")[uri.split("/").length - 1]
    let type = `image/${uri.split('.')[uri.split('.').length - 1]}`
    const file={
        uri:uri,name:filename,type:type
    }
    data.append("digit",file)
    fetch("https://a2aa-59-91-105-211.in.ngrok.io/predictdigit",{
        method:"POST",body:data,headers:{"content-type":"multipart/form-data"}
    })
    .then((response)=>response.json())
    .then((result)=>{
        console.log("Success:",result)
    })
}
}