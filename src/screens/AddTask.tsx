import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Modal } from 'react-native';
import { AddTaskProps } from '../types/AddTask';
import { TextInput } from "react-native-paper";
import Container from '../components/Container';
import { Formik } from "formik";
import * as Yup from 'yup';
import { ThemeState } from '../types/ThemeState';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ms } from 'react-native-size-matters';
import SignatureScreen from "react-native-signature-canvas";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import uuid from "react-native-uuid"
import {setTask} from "../features/taskSlice"
import Toast from 'react-native-toast-message';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  deadline: Yup.date().required('Deadline is required'),
  signature: Yup.string().required('Signature is required'),
  image: Yup.string().required('Image is required'),
});

export default function AddTaskScreen({ navigation }: AddTaskProps): React.JSX.Element {
  const { colors }: ThemeState = useSelector((state: any) => state.theme);
  const { tasks } = useSelector((state: any) => state.task);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const signatureRef = useRef(null);
  const dispatch = useDispatch();

  const styles = createStyles(colors);

  
  const handleAddTask = async (values) => {
    try {
      setIsSubmitting(true)
    const deadlineString = values.deadline instanceof Date ? values.deadline.toISOString() : values.deadline;

    dispatch(setTask({ ...values, _id: uuid.v4(), deadline: deadlineString }));
    Toast.show({
      text1: 'Task Added',
      text2: 'Your task has been successfully added!',
      type: 'success',
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
  });
  setTimeout(()=>{
    navigation.goBack();
  },2000)
  } catch (error) {
      Toast.show({
        text1: 'Error',
        text2: 'An Error Ocurred!',
        type: 'error',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
  });
  setIsSubmitting(false);
    }
    
};
  const handleImagePick = async (setFieldValue: any) => {
    const result = await launchImageLibrary({ 
      mediaType: "photo", 
      selectionLimit: 1 
    });
    if (result.assets) {
      setFieldValue("image", result.assets[0].uri);
    }
  };

  const handleCameraLaunch = async (setFieldValue: any) => {
    const result = await launchCamera({ mediaType: "photo" });
    if (result.assets) {
      setFieldValue('image', result.assets[0].uri);
    }
  };

  return (
    <Container>
      <ScrollView>
      <Formik
        initialValues={{ 
          title: '', 
          description: '', 
          deadline: new Date(), 
          signature: '',
          image: '' 
        }}
        onSubmit={(values) => {
          handleAddTask(values)
        }}
        validationSchema={validationSchema}
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
          <View style={styles.container}>
            {/* Image Upload Section */}
            <View style={styles.imageSection}>
              {values.image ? (
                <Image 
                  source={{ uri: values.image }} 
                  style={styles.imagePreview} 
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={{ color: colors.textSecondary }}>No image selected</Text>
                </View>
              )}
              <View style={styles.imageButtons}>
                <TouchableOpacity
                  style={[styles.imageButton, { backgroundColor: colors.buttonSecondary }]}
                  onPress={() => handleImagePick(setFieldValue)}
                >
                  <Text style={{ color: colors.buttonText }}>Choose Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.imageButton, { backgroundColor: colors.buttonSecondary }]}
                  onPress={() => handleCameraLaunch(setFieldValue)}
                >
                  <Text style={{ color: colors.buttonText }}>Take Photo</Text>
                </TouchableOpacity>
              </View>
              {touched.image && errors.image && (
                <Text style={styles.errorText}>{errors.image}</Text>
              )}
            </View>

            {/* Title Input */}
            <TextInput
              label="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              mode="outlined"
              error={Boolean(touched.title && errors.title)}
              style={styles.input}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.inputBorderFocused}
              textColor={colors.textPrimary}
            />
            {touched.title && errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}

            {/* Description Input */}
            <TextInput
              label="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              mode="outlined"
              multiline
              numberOfLines={4}
              error={Boolean(touched.description && errors.description)}
              style={[styles.input, styles.descriptionInput]}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.inputBorderFocused}
              textColor={colors.textPrimary}
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            {/* Date Picker */}
            <TouchableOpacity 
              style={styles.datePickerContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon 
                name="calendar-month" 
                color={colors.accentPrimary} 
                size={ms(30)} 
              />
              <Text style={styles.dateText}>
                {values.deadline.toDateString()}
              </Text>
              {showDatePicker && (
                <DateTimePicker
                  value={values.deadline}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setFieldValue('deadline', date);
                  }}
                />
              )}
            </TouchableOpacity>
            {touched.deadline && errors.deadline && (
              <Text style={styles.errorText}>{errors.deadline}</Text>
            )}

            {/* Signature Section */}
            <TouchableOpacity style={styles.signatureContainer} onPress={()=> setModalVisible(true)} activeOpacity={1}>
              <Text style={styles.signatureLabel} >Signature:</Text>
              {values.signature && <Image source={{uri: values.signature}} style={styles.signatureImage}/>}
            
              
              {touched.signature && errors.signature && (
                <Text style={styles.errorText}>{errors.signature}</Text>
              )}
            </TouchableOpacity>

            <Modal style={{flex: 1}} visible={modalVisible}>
              <SignatureScreen
                ref={signatureRef}
                onOK={(sig) => {
                  setFieldValue('signature', sig);
                  if(values.signature || sig) {
                    setModalVisible(false);
                  } 
                  
                }}
                onClear={()=>setFieldValue("signature", "")}
                descriptionText="Sign here"
                clearText="Clear"
                confirmText="Save"
                style={styles.signature}
                penColor={colors.textPrimary}
                backgroundColor={colors.backgroundCard}
              />
              </Modal>

            {/* Submit Button */}
            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
      </ScrollView>
    </Container>
  );
}



const createStyles = (colors: ThemeState['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: ms(20),
    backgroundColor: colors.backgroundPrimary,
  },
  input: {
    backgroundColor: colors.inputBackground,
    marginBottom: ms(10),
  },
  descriptionInput: {
    height: ms(100),
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(10),
    marginVertical: ms(15),
    padding: ms(10),
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: ms(5),
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: ms(14),
  },
  signatureContainer: {
    marginVertical: ms(20),
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: ms(5),
    padding: ms(10),
  },
  signatureImage: {
    width: "100%",
    height: ms(100),
    resizeMode: "cover"
  },
  signatureLabel: {
    color: colors.textPrimary,
    fontSize: ms(16),
    marginBottom: ms(10),
  },
  signature: {
    height: ms(120),
    backgroundColor: colors.backgroundCard,
  },
  errorText: {
    color: colors.textError,
    fontSize: ms(12),
    marginBottom: ms(10),
    marginLeft: ms(5),
  },
  submitButton: {
    backgroundColor: colors.buttonPrimary,
    padding: ms(15),
    borderRadius: ms(8),
    alignItems: 'center',
    marginTop: ms(20),
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: ms(16),
    fontWeight: '600',
  },
  imageSection: {
    marginBottom: ms(20),
  },
  imagePreview: {
    width: '100%',
    height: ms(200),
    borderRadius: ms(8),
    marginBottom: ms(10),
  },
  imagePlaceholder: {
    width: '100%',
    height: ms(200),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: colors.inputBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(10),
    backgroundColor: colors.backgroundSecondary,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: ms(10),
    justifyContent: 'space-between',
  },
  imageButton: {
    flex: 1,
    padding: ms(10),
    borderRadius: ms(8),
    alignItems: 'center',
  },
  clearButton: {
    alignSelf: 'flex-end',
    marginTop: ms(10),
  },
});