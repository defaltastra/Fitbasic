import React from 'react';
import { Button } from 'react-native';
import * as Speech from 'expo-speech';

export default function SpeechTestScreen() {
    const testSpeech = () => {
        Speech.speak('Testing text-to-speech functionality.');
    };

    return (
        <Button title="Test Speech" onPress={testSpeech} />
    );
}
