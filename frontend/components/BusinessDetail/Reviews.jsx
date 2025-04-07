import { View, Text, TextInput, TouchableOpacity, ToastAndroid, Image } from 'react-native';
import React, { useState } from 'react';
import { Rating } from 'react-native-ratings';
import { Colors } from '../../constants/Colors';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';

export default function Reviews({ business }) {
  const [rating, setRating] = useState(4);
  const [userInput, setUserInput] = useState('');
  const { user } = useUser(); // Correctly destructure user from useUser()

  const onSubmit = async () => {
    try {
      const docRef = doc(db, 'BusinessList', business.id);
      await updateDoc(docRef, {
        reviews: arrayUnion({
          rating: rating,
          review: userInput,
          userName: user?.fullName,
          userImage: user?.imageUrl,
          userEmail: user?.primaryEmailAddress?.emailAddress
        }),
      });
      ToastAndroid.show('Comment Added Successfully!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to add comment!', ToastAndroid.SHORT);
      console.error('Error adding review:', error);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontFamily: 'outfit-bold' }}>Reviews</Text>
      
      <Rating
        showRating={false}
        imageSize={30}
        onFinishRating={setRating}
        style={{ padding: 30 }}
      />
      
      <TextInput
        placeholder='Write your comment'
        numberOfLines={4}
        onChangeText={setUserInput}
        style={{
          
          borderWidth: 1,
          padding: 10,
          borderRadius: 10,
          borderColor: Colors.GRAY,
          alignItems: 'flex-start',
          textAlignVertical: 'top',
        }}
        value={userInput}
      />
      
      <TouchableOpacity
        disabled={!userInput}
        onPress={onSubmit}
        style={{
          padding: 10,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Submit</Text>
      </TouchableOpacity>

      {/* Display Existing Reviews */}
      <View>
      
        {business?.reviews?.map((item, index) => (
          <View key={index} style={{
            // marginVertical: 10,
            display:'flex',
            flexDirection:'row',
            gap:10,
            alignItems:'center',
            padding:5,
            borderWidth:1,
            borderColor:Colors.GRAY,
            borderRadius:15,
            margin:10,

            }}>
          <Image
            source={{ uri: item.userImage }}
            style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                marginRight: 10,
                }}
          />
          <View style={{
            display:'flex',
            gap:5,
            flex:1
            // marginTop:20,
            // marginBottom:30,
          }}>
          
          <Text style={{
            fontFamily:'outfit-medium',
            fontSize: 15,
           }}>{item.userName}</Text>
          <Rating
            imageSize={15}
            ratingCount={item.rating}
            style={{
                alignItems:'flex-start',
            }}
          />
            <Text style={{ fontSize: 15, fontFamily: 'outfit' ,}}>{item.review}</Text>

          </View>
          </View>
        ))}
      </View>
    </View>
  );
}
