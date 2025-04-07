import { View, Text, FlatList } from 'react-native'
import React, { useEffect,useState } from 'react'
import { Colors } from '../../constants/Colors'
// import { collection, limit, query} from 'firebase/firestore'
import { db } from '../../configs/FirebaseConfig'
import PopularBusinessCard from './PopularBusinessCard'
import { query, collection, limit, getDocs, orderBy } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from 'expo-router';
export default function PopularBusiness() {
    const [loading,setLoading]=useState(false);
    const [BusinessList, setBusinessList] = useState([])
    const router = useRouter();
    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === "admin";
     useEffect(()=>{
        GetBusinessList();
     },[])
    //  const GetBusinessList=async()=>{
    //     setLoading(true);
    //     setBusinessList([]);
    //     const q = query(collection(db,'BusinessList'),limit(20));
    //     const querySnapshot = await getDocs(q);

    //     querySnapshot.forEach((doc) => {
    //         console.log(doc.data());
    //         setBusinessList(prev=>[...prev,{id:doc.id,...doc.data()}])
    //     });
    //     setLoading(false)
    //  }

    const GetBusinessList = async () => {
        setLoading(true);
        setBusinessList([]);
        
        const q = query(collection(db, 'BusinessList')); // Fetch all documents
        const querySnapshot = await getDocs(q);
        
        // Convert snapshot to array and pick random elements
        const allBusinesses = [];
        querySnapshot.forEach((doc) => {
          allBusinesses.push({ id: doc.id, ...doc.data() });
        });
        
        // Shuffle and select a random subset of 20 items
        const randomBusinesses = allBusinesses
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        
        setBusinessList(randomBusinesses);
        setLoading(false);
      };
      
 
   return (
    <View>
      <View
                style={{
                    paddingLeft: 20,
                    marginBottom:10,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    
                }}>
                <Text style={{
                        // paddingLeft: 20,
                        marginTop: 10,
                        fontSize: 20,
                        fontFamily: 'outfit-bold',
                    }}>
                    Popular Business
                </Text>

                {/* <Text style={{
                        color: isAdmin ? '#E90000' : Colors.PRIMARY,
                        fontFamily: 'outfit-medium',
                        position:'absolute',
                        right:20
                    }}>
                    View All
                </Text> */}
            </View>
            <FlatList
            horizontal={true}
                data={BusinessList}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item,index }) => (
                    <PopularBusinessCard
                        key={index}
                        business={item}
                        style={{backgroundColor: isAdmin ? '#f9c8c8' : '#fff',}}
                    />
                )}
            />
    </View>
  )
}