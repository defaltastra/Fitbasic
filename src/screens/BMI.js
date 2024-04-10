import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Modal, TouchableOpacity } from 'react-native';

const TDEECalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activityLevel, setActivityLevel] = useState('1.2'); // Default value
  const [tdee, setTDEE] = useState(null);
  const [bmi, setBMI] = useState(null);
  const [error, setError] = useState('');

  const activityLevels = [
    { label: "Sedentary (Little or No Exercise)", value: "1.2" },
    { label: "Lightly Active (Light Exercise/Sports 1-3 Days/Week)", value: "1.375" },
    { label: "Moderately Active (Moderate Exercise/Sports 3-5 Days/Week)", value: "1.55" },
    { label: "Very Active (Hard Exercise/Sports 6-7 Days a Week)", value: "1.725" },
    { label: "Extremely Active (Very Hard Exercise/Sports & Physical Job or 2x Training)", value: "1.9" }
  ];

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleActivityLevelSelection = (value) => {
    setActivityLevel(value);
    toggleModal();
  };

  const calculateTDEE = () => {
    if (weight && height && age) {
      const bmr = calculateBMR();
      const activityMultiplier = parseFloat(activityLevel);
      const calculatedTDEE = Math.round(bmr * activityMultiplier);
      setTDEE(calculatedTDEE);
      calculateBMI(); // Calculate BMI after TDEE
      setError('');
    } else {
      setError('Please fill in all fields');
      setTDEE(null);
    }
  };

  const calculateBMR = () => {
    const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Harris-Benedict Equation
    return bmr;
  };

  const calculateBMI = () => {
    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    setBMI(bmiValue);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TDEE Calculator</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={(text) => setWeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={(text) => setHeight(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={(text) => setAge(text)}
      />
      <TouchableOpacity style={styles.selectButton} onPress={toggleModal}>
        <Text style={styles.selectButtonText}>Select Activity Level</Text>
      </TouchableOpacity>
      <Button title="Calculate TDEE" onPress={calculateTDEE} />
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {tdee !== null && <Text style={styles.result}>Your TDEE is: {tdee} calories per day</Text>}
      {bmi !== null && <Text style={styles.result}>Your BMI is: {bmi}</Text>}
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {activityLevels.map((item) => (
            <TouchableOpacity
              key={item.value}
              style={styles.modalItem}
              onPress={() => handleActivityLevelSelection(item.value)}
            >
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  selectButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: 200,
    marginBottom: 16,
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  error: {
    marginTop: 20,
    fontSize: 16,
    color: '#F44336',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: '100%',
    alignItems: 'center',
  },
});

export default TDEECalculator;
