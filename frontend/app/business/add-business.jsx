// import { View, Text, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, ToastAndroid } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { useNavigation } from 'expo-router';
// import { Colors } from '../../constants/Colors';
// import * as ImagePicker from 'expo-image-picker';
// import RNPickerSelect from 'react-native-picker-select';
// import axios from 'axios'; // Import axios for making API requests
// import { useUser } from '@clerk/clerk-expo';

// export default function AddBusiness() {
//   const navigation = useNavigation();
//   const [image, setImage] = useState(null);
//   const [categoryList, setCategoryList] = useState([]);
//   const { user } = useUser();
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [contact, setContact] = useState('');
//   const [website, setWebsite] = useState('');
//   const [about, setAbout] = useState('');
//   const [category, setCategory] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     navigation.setOptions({
//       headerTitle: 'Add New Business',
//       headerShown: true,
//     });
//     getCategoryList();
//   }, []);

//   const onImagePick = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImage(result.assets[0].uri);
//     } else {
//       alert('You did not select any image.');
//     }
//   };

//   const getCategoryList = async () => {
//     try {
//       const response = await axios.get('http://192.168.30.88:5000/api/category'); // Replace with your backend endpoint
//       const categories = response.data.map((cat) => ({
//         label: cat.name,
//         value: cat.name,
//       }));
//       setCategoryList(categories);
//     } catch (error) {
//       console.error('Error fetching category list:', error);
//     }
//   };

//   const onAddNewBusiness = async () => {
//     if (!name || !address || !contact || !category || !image) {
//       ToastAndroid.show('Please fill all fields and select an image.', ToastAndroid.LONG);
//       return;
//     }

//     try {
//       setLoading(true);
//       const fileName = Date.now().toString() + '.jpg';
//       const formData = new FormData();

//       formData.append('image', {
//         uri: image,
//         name: fileName,
//         type: 'image/jpeg',
//       });

//       const uploadResponse = await axios.post('http://192.168.30.88:5000/api/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const imageUrl = uploadResponse.data.imageUrl;
//       await saveBusinessDetail(imageUrl);

//       ToastAndroid.show('New business added...', ToastAndroid.LONG);
//     } catch (error) {
//       console.error('Error adding business:', error);
//       ToastAndroid.show('Failed to add business.', ToastAndroid.LONG);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveBusinessDetail = async (imageUrl) => {
//     try {
//       await axios.post('http://192.168.30.88:5000/api/business', {
//         name,
//         address,
//         contact,
//         about,
//         website,
//         category,
//         username: user?.fullName,
//         userEmail: user?.primaryEmailAddress?.emailAddress,
//         userImage: user?.imageUrl,
//         imageUrl,
//       });
//     } catch (error) {
//       console.error('Error saving business details:', error);
//     }
//   };

//   return (
//     <ScrollView>
//       <View style={{ padding: 20 }}>
//         <Text style={{ fontFamily: 'outfit-bold', fontSize: 22 }}>Add New Business</Text>
//         <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>Fill all details in order to add new business</Text>
//         <TouchableOpacity onPress={onImagePick} style={{ marginTop: 10 }}>
//           {!image ? (
//             <Image source={require('../../assets/images/gallery.png')} style={{ width: 100, height: 100 }} />
//           ) : (
//             <Image
//               source={{ uri: image }}
//               style={{
//                 width: 100,
//                 height: 100,
//                 borderRadius: 15,
//               }}
//             />
//           )}
//         </TouchableOpacity>
//         <View>
//           <TextInput
//             placeholder="Name"
//             onChangeText={(v) => setName(v)}
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 15,
//               fontSize: 17,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//               fontFamily: 'outfit',
//             }}
//           />
//           <TextInput
//             placeholder="Address"
//             onChangeText={(v) => setAddress(v)}
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 15,
//               fontSize: 17,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//               fontFamily: 'outfit',
//             }}
//           />
//           <TextInput
//             placeholder="Contact"
//             onChangeText={(v) => setContact(v)}
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 15,
//               fontSize: 17,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//               fontFamily: 'outfit',
//             }}
//           />
//           <TextInput
//             placeholder="Website"
//             onChangeText={(v) => setWebsite(v)}
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 15,
//               fontSize: 17,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//               fontFamily: 'outfit',
//             }}
//           />
//           <TextInput
//             placeholder="About"
//             onChangeText={(v) => setAbout(v)}
//             multiline
//             numberOfLines={5}
//             style={{
//               padding: 10,
//               borderWidth: 1,
//               borderRadius: 15,
//               fontSize: 17,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//               fontFamily: 'outfit',
//               height: 100,
//             }}
//           />
//           <View
//             style={{
//               borderWidth: 1,
//               borderRadius: 15,
//               backgroundColor: '#fff',
//               marginTop: 10,
//               borderColor: Colors.PRIMARY,
//             }}
//           >
//             <RNPickerSelect
//               onValueChange={(value) => setCategory(value)}
//               items={[...categoryList, { label: 'Others', value: 'others' }]}
//             />
//           </View>
//         </View>
//         <TouchableOpacity
//           disabled={loading}
//           style={{
//             padding: 15,
//             backgroundColor: Colors.PRIMARY,
//             borderRadius: 10,
//             justifyContent: 'center',
//             alignItems: 'center',
//             marginTop: 20,
//           }}
//           onPress={onAddNewBusiness}
//         >
//           {loading ? (
//             <ActivityIndicator size={'large'} color={'#fff'} />
//           ) : (
//             <Text style={{ fontFamily: 'outfit-medium', color: '#fff' }}>Add New Business</Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// }


// firebase code
import { View, Text, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, ToastAndroid } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import { collection, query, getDocs, setDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../configs/FirebaseConfig';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddBusiness() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const { user } = useUser();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [website, setWebsite] = useState('');
  const [about, setAbout] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const isAdmin = user?.publicMetadata?.role === "admin";
  
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Add New Business',
      headerShown: true,
      headerStyle: {
        backgroundColor: isAdmin ? '#E90000' : Colors.PRIMARY,
      },
       headerTintColor: '#fff',
    });
    GetCategoryList();
  }, []);

  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result);
    } else {
      alert('You did not select any image.');
    }
  };

  const GetCategoryList = async () => {
    setCategoryList([]);
    const q = query(collection(db, 'Category'));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      console.log(doc.data());
      setCategoryList((prev) => [
        ...prev,
        {
          label: doc.data().name,
          value: doc.data().name,
        },
      ]);
    });
  };

  const onAddNewBusiness = async () => {
    // Input validation
    if (!name) {
      ToastAndroid.show('Please fill the name field.', ToastAndroid.LONG);
      return;
    } else if (!address) {
      ToastAndroid.show('Please fill the address field.', ToastAndroid.LONG);
      return;
    } else if (!contact) {
      ToastAndroid.show('Please fill the contact fields.', ToastAndroid.LONG);
      return;
    } else if (!category) {
      ToastAndroid.show('Please select a category.', ToastAndroid.LONG);
      return;
    } else if (!image) {
      ToastAndroid.show('Please select an image.', ToastAndroid.LONG);
      return;
    }
  
    try {
      setLoading(true);
      const fileName = Date.now().toString() + '.jpg';
      const resp = await fetch(image);
      const blob = await resp.blob();
  
      const imageRef = ref(storage, 'business-app/' + fileName);
  
      await uploadBytes(imageRef, blob);
      console.log('File Uploaded...');
  
      const downloadUrl = await getDownloadURL(imageRef);
      console.log(downloadUrl);
  
      await saveBusinessDetail(downloadUrl);
      ToastAndroid.show('New business added...', ToastAndroid.LONG);
  
      // Reset all fields after a successful addition
      resetFields();
      
    } catch (error) {
      console.error('Error adding business:', error);
      ToastAndroid.show('Failed to add business.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to reset all fields
  const resetFields = () => {
    setName('');
    setAddress('');
    setContact('');
    setWebsite('');
    setAbout('');
    setCategory('');
    setImage(null);
  };
  
  
  

  const saveBusinessDetail = async (imageUrl) => {
    await setDoc(doc(db, 'BusinessList', Date.now().toString()), {
      name: name,
      address: address,
      contact: contact,
      about: about,
      website: website,
      category: category,
      username: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress, // Adjusted to access email correctly
      userImage: user?.imageUrl,
      imageUrl: imageUrl,
    });
    
  };

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        {/* <Text style={{ fontFamily: 'outfit-bold', fontSize: 22 }}>Add New Business</Text> */}
        <Text style={{ fontFamily: 'outfit', color: Colors.GRAY }}>Fill all details in order to add new business</Text>
        <TouchableOpacity onPress={onImagePick} style={{ marginTop: 10 }}>
          {!image ? (
            <Image source={require('../../assets/images/gallery.png')} style={{ width: 100, height: 100 }} />
          ) : (
            <Image
              source={{ uri: image }}
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
              }}
            />
          )}
        </TouchableOpacity>
        <View>
          <TextInput
            placeholder='Name'
            value={name}
            onChangeText={(v) => setName(v)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              fontSize: 17,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor: isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              fontFamily: 'outfit',
            }}
          />

          <TextInput
            placeholder='Address'
            value={address}
            onChangeText={(v) => setAddress(v)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              fontSize: 17,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor:  isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              fontFamily: 'outfit',
            }}
          />

          <TextInput
            placeholder="Contact"
            value={contact}
            keyboardType="numeric" // Sets the keyboard to numeric
            onChangeText={(v) => {
              // Allows only numbers in the input
              const numericValue = v.replace(/[^0-9]/g, ''); // Remove non-numeric characters
              setContact(numericValue);
            }}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              fontSize: 17,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor: isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              fontFamily: 'outfit',
            }}
          />


          <TextInput
            placeholder='Website'
            value={website}
            onChangeText={(v) => setWebsite(v)}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              fontSize: 17,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor:  isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              fontFamily: 'outfit',
            }}
          />

          <TextInput
            placeholder='About'
            value={about}
            onChangeText={(v) => setAbout(v)}
            multiline
            numberOfLines={5}
            style={{
              padding: 10,
              borderWidth: 1,
              borderRadius: 15,
              fontSize: 17,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor:  isAdmin ? '#f9c8c8' : Colors.PRIMARY,
              fontFamily: 'outfit',
              height: 100,
            }}
          />

          <View
            style={{
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor: '#fff',
              marginTop: 10,
              borderColor: isAdmin ? '#f9c8c8' : Colors.PRIMARY,
            }}
          >
            <RNPickerSelect
              onValueChange={(value) => setCategory(value)}
              items={[...categoryList, { label: 'Others', value: 'Others' }]}
            />
          </View>
        </View>
        <TouchableOpacity
          disabled={loading}
          style={{
            padding: 15,
            backgroundColor:  isAdmin ? 'red' : Colors.PRIMARY,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,
          }}
          onPress={onAddNewBusiness}
        >
          {loading ? (
            <ActivityIndicator size={'large'} color={'#fff'} />
          ) : (
            <Text style={{ fontFamily: 'outfit-medium', color: '#fff' }}>Add New Business</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}