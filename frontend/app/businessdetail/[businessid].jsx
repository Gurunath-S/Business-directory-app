import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../configs/FirebaseConfig';
import { Colors } from '../../constants/Colors';
import Intro from '../../components/BusinessDetail/Intro';
import ActionButton from '../../components/BusinessDetail/ActionButton';
import About from '../../components/BusinessDetail/About';
import Reviews from '../../components/BusinessDetail/Reviews';

export default function BusinessDetail() {
    const { businessid } = useLocalSearchParams();
    const navigation = useNavigation();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        GetBusinessDetailById();
    }, [businessid]);

    const GetBusinessDetailById = async () => {
        try {
            const docRef = doc(db, 'BusinessList', businessid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setBusiness({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error fetching business detail:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ActivityIndicator
                style={{ marginTop: '70%' }}
                size={'large'}
                color={Colors.PRIMARY}
            />
        );
    }

    if (!business) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Business Found</Text>
            </View>
        );
    }

    // Data array for FlatList to render all components as list items
    const data = [
        { key: 'intro', component: <Intro business={business} /> },
        { key: 'action', component: <ActionButton business={business} /> },
        { key: 'about', component: <About business={business} /> },
        { key: 'reviews', component: <Reviews business={business} /> },
    ];

    return (
        <FlatList
            data={data}
            renderItem={({ item }) => item.component}
            keyExtractor={(item) => item.key}
            contentContainerStyle={{ paddingBottom: 20 }}
        />
    );
}
