import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React,{useState , useEffect} from 'react'
import { useAuth } from '../../context/AuthContext';
import UserTheme from '../../constant/Theme';
import PrimaryGradientButton from '../../components/Buttons/PrimaryGradientButton';
import GradientText from '../../components/GradientText';
import Fonts from '../../constant/Fonts';
import { shadowStyle } from '../../constant/Shadow';
import { categoriesData } from '../../constant/dataStatic/categoriesData';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import ImageCropPicker from 'react-native-image-crop-picker';
import { showMessage } from 'react-native-flash-message';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import FastImage from 'react-native-fast-image';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
const AddPost = ({navigation}) => {

  const { currentUser } = useAuth();
  const [postType, setPostType] = useState('lookingForService');
  const [images , setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [openCategory, setOpenCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openOption, setOpenOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);


  const categoryItems = categoriesData.map((category) => ({
    label: category.text,
    value: category.id.toString(),
  }));

  const optionItems = selectedCategory
    ? categoriesData
        .find((category) => category.id === parseInt(selectedCategory))
        .options.map((option) => ({
          label: option.text,
          value: option.optionId.toString(),
        }))
    : [];

  useEffect(() => {
    setOpenOption(false);
  }, [selectedCategory]);

  return (
   
    <ScrollView style={styles.container}
      contentContainerStyle={styles.center}
      nestedScrollEnabled={true}
    >
      <TouchableOpacity style={styles.imageInput}>
        <GradientText text="Upload" size={35} />
        <GradientText text="Image" size={35} />

      </TouchableOpacity> 
      <TextInput
        style={styles.title}
        placeholder="Title"
        placeholderTextColor={UserTheme.text}
        onChangeText={(text) => setTitle(text)}
      />
      <TextInput
        style={styles.price}
        placeholder="Price"
        placeholderTextColor={UserTheme.text}
        keyboardType='numeric' // Set the keyboard type to numeric
        onChangeText={(text) => {
          // Allow only numeric input (including decimal point)
          const newText = text.replace(/[^0-9.]/g, '');
          setPrice(newText);
        }}
        value={price}
      />

   <DropDownPicker
            open={openCategory}
            value={selectedCategory}
            items={categoryItems}
            setOpen={setOpenCategory}
            setValue={setSelectedCategory}
            setItems={() => {}}
            zIndex={1000}
            style={dropdown.dropdown}
            textStyle={dropdown.textStyle}
            placeholder='Choose category'
            dropDownContainerStyle={dropdown.dropdownContainer}
            ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
            ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
            TickIconComponent={() => <FontAwesomeIcon size={20} color={UserTheme.primary} icon="fa-solid fa-check" />}
         />

          {selectedCategory && (
              <DropDownPicker
                open={openOption}
                value={selectedOption}
                items={optionItems}
                setOpen={setOpenOption}
                setValue={setSelectedOption}
                setItems={() => {}}
                zIndex={500}
                placeholder='Choose option'
                style={dropdown.dropdown}
                textStyle={dropdown.textStyle}
                dropDownContainerStyle={dropdown.dropdownContainer}
                ArrowUpIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-up" />}
                ArrowDownIconComponent={() => <FontAwesomeIcon size={30} color={UserTheme.primary} icon="fa-solid fa-caret-down" />}
                TickIconComponent={() => <FontAwesomeIcon size={20} color={UserTheme.primary} icon="fa-solid fa-check" />}
              />
          )}
      <TextInput  
        style={styles.description}
        placeholder="Description"
        placeholderTextColor={UserTheme.text}
        multiline={true}
        onChange={(text)=>setDescription(text)}
      />
      <PrimaryGradientButton style={styles.Post} text="Post" onPress={()=>handlePost} />
    </ScrollView>
  )
}

export default AddPost

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:UserTheme.white,
    paddingHorizontal:20,
    paddingTop:20,
  },
  center:{
    justifyContent:'center',
    alignItems:'center',
    gap:10,
    paddingBottom:100,
  },
  imageInput:{
    height:200,
    width:'100%',
    backgroundColor:UserTheme.lightgrey,
    borderRadius:10,
    justifyContent:'center',
    alignItems:'center',
    borderWidth:2.5,
    borderColor:UserTheme.primary
  },
  title:{
    width:'100%',
    height:40,
    borderColor:UserTheme.primary,
    borderWidth:2.5,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:UserTheme.text,
  },
  price:{
    width:'100%',
    height:40,
    borderColor:UserTheme.primary,
    borderWidth:2.5,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:UserTheme.text,
  },
  description:{
    width:'100%',
    height:150,
    borderColor:UserTheme.primary,
    borderWidth:2.5,
    borderRadius:10,
    fontSize:17,
    paddingHorizontal:10,
    color:UserTheme.text,
    marginBottom:10,
    textAlignVertical:'top',
  },
})
const dropdown = StyleSheet.create({
  container:{
    width:'100%',
    margin:0,
    gap:10,
    backgroundColor:UserTheme.white,
    zIndex: 9999,
  },
  dropdown: {
    borderColor: UserTheme.primary,
    borderradius:10,
    borderWidth: 2.5,
    zIndex: 99,

  },
  textStyle: {
    fontSize: 17,
  },
  dropdownContainer: {
    backgroundColor: UserTheme.white,

    borderColor: UserTheme.primary,
    borderWidth: 2.5,
  },
})