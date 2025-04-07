import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../../constants/Colors'
import { useRouter } from 'expo-router'
export default function BusinessListCard({business}) {
  const router =useRouter()
  return (
    <TouchableOpacity style={{
      padding:10,
      margin:10,
      borderRadius:15,
      backgroundColor:'#fff',
      display:'flex',
      flexDirection:'row',
      gap:10,
      alignItems:'center',
    }}
    onPress={()=>router.push('/businessdetail/'+business.id)}
    
    >
      <Image source={{uri:business.imageUrl}}
        style={{width: 100, height: 100, borderRadius: 10}}
      />
      <View style={{
        flex:1,
        gap:7
      }}>
        <Text style={{
          fontFamily:'outfit-bold',
          fontSize:16,
        }}>{business.name}</Text>
        <Text style={{
          fontFamily:'outfit',
          color:Colors.GRAY,
          fontSize:13,
          flex:1,
        }}>{business.address}</Text>
        <View style={{ display:'flex',flexDirection:'row',gap:5 }}>
      <Image source={require('../../assets/images/star.png')}
        style={{width: 15,
        height: 15,
        marginTop:3,
        }}
      />
      <Text style={{fontFamily:'outfit',marginTop:2,}}>4.5</Text>
    </View>
      </View>
    </TouchableOpacity>
  )
}