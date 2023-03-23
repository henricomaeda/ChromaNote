// Import necessary libraries and modules.
import Icon from 'react-native-vector-icons/MaterialIcons';
import { StackActions } from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react';
import {
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
    ScrollView,
    FlatList,
    Alert,
    View,
    Text,
} from 'react-native';

// Import global variables and storage functions.
import '../utils/constants/Globals';
import {
    storeData,
    getData,
    removeData
} from '../utils/functions/StorageData';

// Import timezone and date functions.
import { formatDate } from '../utils/functions/DateHelpers';

// Import global styles and define styles.
import globalStyles from '../utils/constants/Styles'
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sortText: {
        marginBottom: global.windowWidth / 12.6,
        marginTop: global.windowWidth / 26,
        borderColor: global.highlightColor,
        fontSize: global.windowWidth / 22,
        padding: global.windowWidth / 52,
        color: global.shadeColor,
    },
    noteComponent: {
        marginHorizontal: global.windowWidth / 36,
        backgroundColor: global.foregroundColor,
        marginBottom: global.windowWidth / 18,
        borderRadius: global.windowWidth / 18,
        padding: global.windowWidth / 32,
        width: "42%",
    },
    noteTitle: {
        marginBottom: global.windowWidth / 32,
        fontSize: global.windowWidth / 26,
        color: global.tintColor,
        flex: 0,
    },
    noteText: {
        marginBottom: global.windowWidth / 32,
        fontSize: global.windowWidth / 27.2,
        textAlignVertical: 'top',
        color: global.shadeColor,
        textAlign: 'justify',
        flexWrap: 'wrap',
        padding: 0,
        flex: 1,
    },
    noteInfo: {
        fontSize: global.windowWidth / 30,
        color: global.deepShadeColor,
        alignSelf: 'flex-end',
    },
    noteIcon: {
        color: global.deepShadeColor,
        alignSelf: 'flex-end',
        flex: 0,
    },
    ...globalStyles,
});

// Define the screen component.
const MainScreen = ({ navigation }) => {
    // Define state variables.
    const [moreDetails, setMoreDetails] = useState(false);
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState([])

    // Load the data and update the state variable.
    const loadData = async () => {
        try {
            const storedData = await getData('notes', true);
            if (storedData) {
                const sortedData = storedData.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()))
                storeData('notes', sortedData, true)
                setData(storedData)
            };
        }
        catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Define the constructor.
    useEffect(() => {
        // Add a listener to reload the data when the screen is focused.
        const unsubscribe = navigation.addListener('focus', loadData);

        // Remove the listener when the component unmounts.
        return unsubscribe;
    }, [navigation]);

    // Navigate to the Note screen and pass route params.
    const navigateToNote = (data, id) => {
        const screen = 'NoteScreen';
        const params = data && id > -1 ? {
            id: id,
            name: data.name,
            note: data.note,
            createdDate: new Date(data.createdDate).getTime(),
            checklist: JSON.stringify(data.checklist.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()))),
            editable: false
        } : null;

        const pushAction = StackActions.push(screen, params);
        navigation.dispatch(pushAction);
    }

    // Creates a reference to the ScrollView using the useRef hook;
    const flatListRef = useRef();

    // Sets the visible state based on whether the vertical position is;
    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        setVisible(y >= 20);
    };

    // Uses the scrollViewRef created with the useRef hook to scroll the ScrollView to the top.
    const handlePress = () => flatListRef.current.scrollToOffset({
        offset: 0,
        animated: true
    });

    // Render the component.
    return (
        <View style={styles.container}>
            <View
                style={{
                    justifyContent: 'space-evenly',
                    flexDirection: 'row',
                }}>
                <TouchableOpacity
                    activeOpacity={moreDetails ? 0.2 : 0.6}
                    onPress={() => moreDetails && setMoreDetails(false)}>
                    <Text
                        style={[
                            styles.sortText,
                            !moreDetails && {
                                borderBottomWidth: global.windowWidth / 142,
                                color: global.highlightColor
                            }
                        ]}>
                        Hide Details
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={!moreDetails ? 0.2 : 0.6}
                    onPress={() => !moreDetails && setMoreDetails(true)}>
                    <Text
                        style={[
                            styles.sortText,
                            moreDetails && {
                                borderBottomWidth: global.windowWidth / 142,
                                color: global.highlightColor
                            }
                        ]}>
                        More Details
                    </Text>
                </TouchableOpacity>
            </View>
            <FlatList
                ref={flatListRef}
                onScroll={handleScroll}
                scrollEventThrottle={20}
                columnWrapperStyle={{ alignSelf: 'center' }}
                numColumns={2}
                data={data}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        onPress={() => navigateToNote(item, index)}
                        onLongPress={() => Alert.alert(
                            item.name,
                            'Remove this note?',
                            [{ text: 'Cancel' },
                            {
                                text: 'Remove',
                                onPress: () => {
                                    try {
                                        const noteId = index;
                                        const actualData = data;
                                        const newData = actualData.filter((item, index) => index != noteId);

                                        // se funcionar, colocar para remover os dados.
                                        if (!newData || newData.length <= 0) {
                                            removeData('notes');
                                            setData([]);
                                        }
                                        else {
                                            storeData('notes', newData, true);
                                            setData(newData);
                                        }
                                    }
                                    catch (error) {
                                        console.error('Error removing an note:', error);
                                    }
                                }
                            }],
                            { cancelable: false }
                        )}
                        style={styles.noteComponent}>
                        <Text
                            numberOfLines={1}
                            style={styles.noteTitle}>
                            {item.name}
                        </Text>
                        <Text
                            numberOfLines={moreDetails ? 4 : 2}
                            style={styles.noteText}>
                            {item.note}
                        </Text>
                        <View
                            style={{
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                                flexWrap: 'wrap',
                                flex: 0,
                            }}>
                            <Icon
                                name='description'
                                style={styles.noteIcon}
                                color={global.tintColor}
                                size={global.windowWidth / 14}
                            />
                            <View style={{ alignSelf: 'flex-end', flex: 1 }}>
                                {moreDetails && (
                                    <>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.noteInfo}>
                                            {item.note ? item.note.trim().split(/\s+/).length : 0} words
                                        </Text>
                                        <Text
                                            numberOfLines={1}
                                            style={styles.noteInfo}>
                                            {item.checklist ? item.checklist.length : 0} checkboxes
                                        </Text>
                                    </>
                                )}
                                <Text
                                    numberOfLines={1}
                                    style={styles.noteInfo}>
                                    {formatDate(item.createdDate, false)}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            <View style={styles.floatContainer}>
                {visible && (
                    <TouchableOpacity
                        style={styles.floatButton}
                        onPress={handlePress}>
                        <Icon
                            name='expand-less'
                            color={global.highlightColor}
                            size={global.windowWidth / 12}
                        />
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    onPress={() => navigateToNote()}
                    style={[
                        styles.floatButton,
                        {
                            backgroundColor: global.highlightColor,
                        }
                    ]}>
                    <Icon
                        name='post-add'
                        color={global.tintColor}
                        size={global.windowWidth / 14}
                    />
                </TouchableOpacity>
            </View>
        </View >
    );
};

// Export the screen component.
export default MainScreen;
