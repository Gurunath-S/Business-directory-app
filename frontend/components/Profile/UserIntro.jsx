import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'

export default function UserIntro() {
    const {user}=useUser();
  return (
    <View style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:30,
    }}>
      <Image source={{uri:user?.imageUrl}}
        style={{
            width:100,
            height:100,
            borderRadius:50,
        }}
      />
      <View style={{
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        borderRadius:99,
      }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:20,
        color:'#fff',
      }}>{user?.fullName}</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:16,
        color:'#fff',

      }}>{user?.primaryEmailAddress?.emailAddress}</Text>
      </View>
    </View>
  )
}
