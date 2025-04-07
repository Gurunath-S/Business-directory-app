import { View, Text, FlatList, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Make sure to install axios if you haven't already
import apikey from '../../configs/Apikey';
export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    getSliderList();
  }, []);

  const getSliderList = async () => {
    try {
      // Make an API call to fetch the slider data from your backend
      const response = await axios.get(`http://${apikey}:5000/api/slider`); // Replace with your actual endpoint
      setSliderList(response.data);
    } catch (error) {
      console.error('Error fetching slider data:', error);
    }
  };

  return (
    <View>
      <Text style={{
        fontFamily: 'outfit-bold',
        fontSize: 20,
        paddingLeft: 20,
        paddingTop: 20,
        marginBottom: 5,
      }}>
        #Special for you
      </Text>
      <FlatList
        data={sliderList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          paddingLeft: 20,
        }}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item.imageUrl }} // Make sure imageUrl is the correct field in your database
            style={{
              width: 300,
              height: 150,
              borderRadius: 15,
              marginRight: 15,
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}




// // //firebase
// import { View, Text, FlatList, Image } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, query } from 'firebase/firestore';
// import { db } from '../../configs/FirebaseConfig';

// export default function Slider() {
//   const [SliderList, setSliderList] = useState([]);

//   useEffect(() => {
//     GetSliderList();
//   }, []);

//   const GetSliderList = async () => {
//     setSliderList([]);
//     const q = query(collection(db, 'Slider'));
//     const querySnapshot = await getDocs(q);

//     const sliders = [];
//     querySnapshot.forEach((doc) => {
//       console.log(doc.data());
//       sliders.push(doc.data());
//     });
//     setSliderList(sliders);
//   };

//   return (
//     <View>
//       <Text style={{
//         fontFamily: 'outfit-bold',
//         fontSize: 20,
//          paddingLeft:20,
//          paddingTop:20,
//          marginBottom:5,
//           }}>
//         #Special for you
//       </Text>
//       <FlatList
//         data={SliderList}
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}
//         style={{
//             paddingLeft:20,
//         }}
//         renderItem={({ item }) => (
//           <Image
//             source={{ uri: item.imageUrl }}
//             style={{
//               width: 300,
//               height: 150,
//              borderRadius:15,
//              marginRight:15,
//             }}
//           />
//         )}
//         keyExtractor={(item, index) => index.toString()}
//       />
//     </View>
//   );
// }
