import { View, Text, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Colors } from '../../constants/Colors';
import CategoryItem from './CategoryItems';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import axios from 'axios'; // You can use fetch if you prefer
import apikey from '../../configs/Apikey';

export default function Category({ explore = false, onCategorySelect }) {
  const [categoryList, setCategoryList] = useState([]);
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    fetchCategoryList();
  }, []);

  const fetchCategoryList = async () => {
    try {
      // Fetch categories from the backend
      const response = await axios.get(`http://${apikey}:5000/api/Category`);
      console.log(response);
      setCategoryList(response.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const onCategoryPressHandler = (item) => {
    if (!explore) {
      router.push('/businesslist/' + item.name);
    } else {
      onCategorySelect(item.name);
    }
  };

  return (
    <View>
      {/* Conditional rendering for the header when explore is false */}
      {!explore && (
        <View
          style={{
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'outfit-bold',
            }}
          >
            Category
          </Text>

          <Text
            style={{
              color: isAdmin ? Colors.PRIMARY:'#E90000',
              fontFamily: 'outfit-medium',
            }}
          >
            View All
          </Text>
        </View>
      )}

      {/* FlatList for rendering category items */}
      <FlatList
        data={categoryList}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginLeft: 15 }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <CategoryItem
            category={item}
            onCategoryPress={() => onCategoryPressHandler(item)}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ padding: 20, textAlign: 'center' }}>
            No Categories Available
          </Text>
        )}
      />
    </View>
  );
}





// // firebasecode
// import { View, Text, FlatList } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { Colors } from '../../constants/Colors';
// import { collection, getDocs, query } from 'firebase/firestore';
// import { db } from '../../configs/FirebaseConfig';
// import CategoryItem from './CategoryItems';
// import { useRouter } from 'expo-router';

// export default function Category({ explore = false, onCategorySelect }) {
//   const [categoryList, setCategoryList] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     fetchCategoryList();
//   }, []);

//   const fetchCategoryList = async () => {
//     try {
//       const q = query(collection(db, 'Category'));
//       const querySnapshot = await getDocs(q);
//       const categories = querySnapshot.docs.map((doc) => doc.data());
//       setCategoryList(categories);
//     } catch (err) {
//       console.error('Error fetching categories:', err);
//     }
//   };

//   const onCategoryPressHandler = (item) => {
//     if (!explore) {
//       router.push('/businesslist/' + item.name);
//     } else {
//       onCategorySelect(item.name); // Notify parent of category selection
//     }
//   };

//   return (
//     <View>
//       {/* Conditional rendering for the header when explore is false */}
//       {!explore && (
//         <View
//           style={{
//             padding: 20,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginTop: 10,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 20,
//               fontFamily: 'outfit-bold',
//             }}
//           >
//             Category
//           </Text>

//           <Text
//             style={{
//               color: Colors.PRIMARY,
//               fontFamily: 'outfit-medium',
//             }}
//           >
//             View All
//           </Text>
//         </View>
//       )}

//       {/* FlatList for rendering category items */}
//       <FlatList
//         data={categoryList}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={{ marginLeft: 15 }}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <CategoryItem
//             category={item}
//             onCategoryPress={() => onCategoryPressHandler(item)}
//           />
//         )}
//         ListEmptyComponent={() => (
//           <Text style={{ padding: 20, textAlign: 'center' }}>
//             No Categories Available
//           </Text>
//         )}
//       />
//     </View>
//   );
// }
