import { View, Text , Image} from 'react-native'
import React from 'react'
// import { Colors } from '../../constants/Colors'
import { TouchableOpacity } from 'react-native'
import { useUser } from '@clerk/clerk-expo';
export default function CategoryItem({category,onCategoryPress}) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  return (
    <TouchableOpacity onPress={()=>onCategoryPress(category)}>
    <View style={{padding:15,
      backgroundColor:isAdmin ? '#f9c8c8' : '#EFDCF9',
      borderRadius:99,
      marginRight:10,
      
    }}>
     <Image source={{uri:category.icon}}
      style={{width: 33, height: 33}}
     />
     </View>
     <Text style={{
      fontSize:12,
      fontFamily:'outfit-medium',
      textAlign:'center',
      marginTop:5,
     }}>{category.name}</Text>
    </TouchableOpacity>
  )
}