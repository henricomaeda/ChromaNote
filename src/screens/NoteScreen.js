// Import necessary libraries and modules.
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useRef, createRef } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    TextInput,
    Alert,
    View,
    Text
} from 'react-native';

// Import global variables and storage functions.
import '../utils/constants/Globals';
import {
    storeData,
    getData,
    removeData
} from '../utils/functions/StorageData';

// Import timezone and date functions.
import {
    convertToTimeZone,
    formatDate
} from '../utils/functions/DateHelpers';

// Import global styles and define styles.
import globalStyles from '../utils/constants/Styles'
const styles = StyleSheet.create({
    checkbox: {
        borderRadius: global.windowWidth / 92,
        marginBottom: global.windowWidth / 84,
        marginRight: global.windowWidth / 42,
        marginTop: global.windowWidth / 84,
        height: global.windowWidth / 18,
        width: global.windowWidth / 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    highlightButton: {
        backgroundColor: global.highlightColor
    },
    ...globalStyles,
});

// Import a Note class.
import { Note } from '../utils/models/Note';

// Define the screen component.
const NoteScreen = ({ navigation, route }) => {
    // Define state variables.
    const [id, setId] = useState(route.params ? route.params.id : -1)
    const [name, setName] = useState(route.params ? route.params.name : '')
    const [note, setNote] = useState(route.params ? route.params.note : '')
    const [createdDate, setCreatedDate] = useState(route.params ? new Date(route.params.createdDate) : convertToTimeZone(new Date()))
    const [editable, setEditable] = useState(route.params ? route.params.editable : true);
    const [checklist, setChecklist] = useState(route.params ? JSON.parse(route.params.checklist) : [])
    const [visible, setVisible] = useState(false);

    // Defines a variable to count the number of words in note.
    const wordCount = note ? note.trim().split(/\s+/).length : 0;

    // Defines an function to save the data.
    const saveData = async (newChecklist) => {
        try {
            // Create an array to store notes
            let notes = [];

            // Creates a new note.
            let newNote = new Note(name, note, createdDate, checklist);

            if (newChecklist) {
                if (newChecklist.length > 0) newNote = new Note(name, note, createdDate, newChecklist);
                else newNote = new Note(name, note, createdDate, []);
            }
            else if (!checklist || checklist.length == 0) newNote = new Note(name, note, createdDate, []);

            // Verify if user has notes.
            const storedData = await getData('notes', true);
            if (storedData) notes = [...storedData];

            // Add or update an note.
            if (id == -1) notes.push(newNote);
            else notes[id] = newNote;

            // Sort and save the data.
            const sortedData = notes.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
            storeData('notes', sortedData, true);

            // Return to the main screen.
            if (id == -1) navigation.pop();
        }
        catch (error) {
            console.log('Error saving data:', error);
        }
    }

    // Defines an function to add an new Checkbox.
    const addCheckbox = () => {
        if (checklist.length < 12) {
            const updatedChecklist = [...checklist];
            updatedChecklist.push({
                'name': 'New checkbox',
                'checked': false
            });

            const sortedChecklist = updatedChecklist.sort((a, b) => a.name.trim().toLowerCase().localeCompare(b.name.trim().toLowerCase()));
            setChecklist(sortedChecklist);
        }
        else Alert.alert(name, 'Reached the limit of 12 checkboxes.')
    };

    // Define a Checkbox component that takes id, name, and checked props.
    const Checkbox = (id, name, checked) => {
        // Save a reference to the TextInput component
        const textInputRef = createRef();

        // Focus on the TextInput component
        const handleButtonClick = () => {
            textInputRef.current.focus();
        };

        // Define the check function to toggle the checked state of the checkbox;
        const check = () => {
            const updatedChecklist = [...checklist];
            updatedChecklist[id].checked = !checked;
            setChecklist(updatedChecklist);
            saveData();
        };

        // Define the changeText function to update the name of the checkbox;
        const changeText = (newName) => {
            const updatedChecklist = [...checklist];
            updatedChecklist[id].name = newName;
            setChecklist(updatedChecklist);
        }

        // Define the remove function to remove the checkbox from the list;
        const remove = () => Alert.alert(
            name,
            'Remove this checkbox?',
            [{ text: 'Cancel' },
            {
                text: 'Remove',
                onPress: () => {
                    let updatedChecklist = [...checklist];
                    updatedChecklist = updatedChecklist.filter((item, index) => index != id);
                    setChecklist(updatedChecklist);
                    saveData(updatedChecklist);
                }
            }],
            { cancelable: false }
        );

        // Render the checkbox with a checkbox icon and text input field;
        return (
            <TouchableOpacity
                key={id}
                onPress={() => !editable ? check() : handleButtonClick()}
                onLongPress={() => !editable && remove()}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <View
                    style={[
                        styles.checkbox,
                        {
                            backgroundColor: checked
                                ? global.highlightColor
                                : global.tintColor
                        }
                    ]}>
                    {editable ? (
                        <Icon
                            name='edit'
                            color={
                                checked
                                    ? global.tintColor
                                    : global.highlightColor
                            }
                            size={global.windowWidth / 22.6}
                        />
                    ) : checked && (
                        <Icon
                            name='done'
                            color={global.tintColor}
                            size={global.windowWidth / 18}
                        />
                    )}
                </View>
                {editable ? (
                    <TextInput
                        ref={textInputRef}
                        maxLength={32}
                        value={name}
                        editable={editable}
                        onChangeText={changeText}
                        style={[{
                            fontSize: global.windowWidth / 20,
                            color: global.shadeColor,
                            flexShrink: 1,
                            padding: 0,
                        }, !editable && checked && {
                            textDecorationThickness: global.windowWidth / 62,
                            textDecorationColor: global.shadeColor,
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            color: global.deepShadeColor,
                        }]}
                    />
                ) : (
                    <Text
                        numberOfLines={1}
                        style={[{
                            fontSize: global.windowWidth / 20,
                            color: global.shadeColor,
                            flexShrink: 1,
                            padding: 0,
                        }, !editable && checked && {
                            textDecorationThickness: global.windowWidth / 62,
                            textDecorationColor: global.shadeColor,
                            textDecorationLine: 'line-through',
                            textDecorationStyle: 'solid',
                            color: global.deepShadeColor,
                        }]}>
                        {name}
                    </Text>
                )}
            </TouchableOpacity>
        )
    }

    // Creates a reference to the ScrollView using the useRef hook;
    const scrollViewRef = useRef();

    // Sets the visible state based on whether the vertical position is;
    const handleScroll = (event) => {
        const { y } = event.nativeEvent.contentOffset;
        setVisible(y >= 20);
    };

    // Uses the scrollViewRef created with the useRef hook to scroll the ScrollView to the top.
    const handlePress = () => scrollViewRef.current.scrollTo({
        x: 0,
        y: 0,
        animated: true
    });

    // Render the component.
    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                ref={scrollViewRef}
                onScroll={handleScroll}
                scrollEventThrottle={20}
                contentContainerStyle={{
                    padding: global.windowWidth / 22,
                    flexGrow: 1,
                }}>
                {!name || editable ? (
                    <TextInput
                        value={name}
                        maxLength={60}
                        editable={editable}
                        onChangeText={setName}
                        placeholder='Add title here'
                        placeholderTextColor={global.shadeColor}
                        style={{
                            fontSize: global.windowWidth / 18,
                            color: global.tintColor,
                            padding: 0,
                        }}
                    />
                ) : (
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: global.windowWidth / 18,
                            color: global.tintColor,
                        }}>
                        {name}
                    </Text>
                )}
                <Text
                    style={{
                        marginTop: global.windowWidth / 26,
                        fontSize: global.windowWidth / 26,
                        color: global.deepShadeColor,
                    }}>
                    {formatDate(createdDate)} | {!note || note.trim().length <= 0 ? 0 : wordCount} words
                </Text>
                <TextInput
                    style={{
                        marginBottom: global.windowWidth / 26,
                        lineHeight: global.windowWidth / 16,
                        marginTop: global.windowWidth / 26,
                        fontSize: global.windowWidth / 26,
                        color: global.shadeColor,
                        textAlignVertical: 'top',
                        padding: 0,
                    }}
                    placeholder='Add your thoughts and ideas'
                    placeholderTextColor={shadeColor}
                    onChangeText={setNote}
                    maxLength={1000}
                    value={note}
                    multiline={true}
                    editable={editable}>
                </TextInput>
                <Text
                    style={{
                        marginBottom: global.windowWidth / 32,
                        fontSize: global.windowWidth / 26,
                        color: global.deepShadeColor,
                    }}>
                    Checklist:
                </Text>
                {!checklist || checklist.length <= 0 ? (
                    <Text
                        numberOfLines={1}
                        style={{
                            fontSize: global.windowWidth / 26,
                            color: global.deepShadeColor,
                        }}>
                        No items added to the checklist yet
                    </Text>
                ) : checklist.map((checkbox, index) =>
                    Checkbox(index, checkbox.name, checkbox.checked)
                )}
            </ScrollView>
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
                {editable ? (
                    <>
                        <TouchableOpacity
                            style={styles.floatButton}
                            onPress={addCheckbox}>
                            <Icon
                                name='library-add'
                                color={global.highlightColor}
                                size={global.windowWidth / 18}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.floatButton, styles.highlightButton]}
                            onPress={() => {
                                if (!name || name.trim().length == 0) Alert.alert(global.appName, 'Please provide a title for your note.');
                                else {
                                    const filteredData = checklist.filter(item => item.name && item.name.trim().length > 0);

                                    if (filteredData.length == 0) setChecklist([]);
                                    else setChecklist(filteredData);

                                    saveData();
                                    setEditable(!editable);
                                }
                            }}>
                            <Icon
                                name={id == -1 ? 'add' : 'done'}
                                color={global.tintColor}
                                size={global.windowWidth / 18}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.floatButton, styles.highlightButton]}
                        onPress={() => setEditable(!editable)}>
                        <Icon
                            name='edit'
                            color={global.tintColor}
                            size={global.windowWidth / 18}
                        />
                    </TouchableOpacity>
                )}
            </View>
        </View >
    );
};

// Export the screen component.
export default NoteScreen;
