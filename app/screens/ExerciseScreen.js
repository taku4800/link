import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Image } from 'react-native';
import moment from 'moment';
import Svg, { Path } from 'react-native-svg';

export default function ExerciseScreen({ navigation }) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('00:00');
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [characterImage, setCharacterImage] = useState(require('../image/image_advice.png'));
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm'));
  const [showBubble, setShowBubble] = useState(false);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('HH:mm'));
      if (isRunning && startTime) {
        const duration = moment.duration(moment().diff(startTime));
        setElapsedTime(`${String(duration.minutes()).padStart(2, '0')}:${String(duration.seconds()).padStart(2, '0')}`);
        setCaloriesBurned(Math.floor(duration.asSeconds() * 0.5)); // 仮の消費カロリー計算
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isRunning, startTime]);

  const handleStartRunning = () => {
    setIsRunning(true);
    setStartTime(moment());
  };

  const handleStopRunning = () => {
    setIsRunning(false);
    setShowBubble(true);
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../image/image_g2.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          {!isRunning && !showBubble && (
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{currentTime}</Text>
              <Image source={characterImage} style={styles.characterImage1} />
            </View>
          )}
          {isRunning ? (
            <>
              <View style={styles.Container2}>
                <Text style={styles.elapsedTimeText}>経過時間　{elapsedTime}</Text>
                <Text style={styles.caloriesText}>現在の消費カロリー　{caloriesBurned}</Text>
              </View>
              <TouchableOpacity style={styles.button3} onPress={handleStopRunning}>
                <Text style={styles.buttonText}>終了</Text>
              </TouchableOpacity>
            </>
          ) : showBubble ? (
            <>
              <View style={styles.bubbleContainer}>
                <Svg height={height * 0.9} width={width * 0.9} viewBox="0 0 100 100" style={styles.bubble}>
                  <Path
                    d="M0 0 H 100 V 120 H 60 L 30 130 L 40 120 H 0 Z"
                    fill="rgba(255, 182, 193, 0.8)"
                  />
                </Svg>
                <View style={styles.bubbleTextContainer}>
                  <Text style={styles.bubbleText}>走行時間 {elapsedTime}</Text>
                  <View style={styles.meterContainer}>
                    <Text style={styles.meterLabel}>消費カロリー {caloriesBurned}</Text>
                    <View style={styles.meterBackground}>
                      <View style={[styles.meterFill, { width: `${caloriesBurned}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.bubbleScore}>運動スコア {Math.min(caloriesBurned / 10, 100)}</Text>
                  <View style={styles.bubbleGoodContainer}>
                    <Text style={styles.bubbleGood}>素晴らしい運動でした！{"\n"}次回も頑張りましょう！</Text>
                  </View>
                </View>
              </View>
              <Image source={require('../image/image_advice.png')} style={styles.characterImage} />
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.button1} onPress={handleStartRunning}>
                <Text style={styles.buttonText}>走り始める！</Text>
              </TouchableOpacity>
            </>
          )}
          {!isRunning && (
            <TouchableOpacity style={[styles.button2, styles.homeButton]} onPress={handleGoHome}>
              <Text style={styles.buttonText}>ホームへ</Text>
            </TouchableOpacity>
          )}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 80,
    color: 'black',
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
    textAlign: 'center',
  },
  timeContainer: {
    position: 'absolute',
    top: 200,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // やや透過させた白
    padding: 10,
    alignItems: 'center',
  },
  Container2: {
    position: 'absolute',
    top: 200,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 0, 0.5)', // やや透過させた白
    padding: 10,
    alignItems: 'center',
  },
  elapsedTimeText: {
    fontSize: 24,
    marginBottom: 20,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  caloriesText: {
    fontSize: 24,
    marginBottom: 20,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  characterImage1: {
    width: 100,
    height: 100,
    position: 'absolute',
    bottom: -200,
    zIndex: 1,
  },
  characterImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 1,
  },
  button1: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    top: 265,
    left: 70,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    marginBottom: 10,
  },
  button2: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    left: -80,
  },
  button3: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 6,
    top: 150,
  },
  buttonText: {
    color: '#212529',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },
  homeButton: {
    position: 'absolute',
    bottom: 20,
  },
  bubbleContainer: {
    position: 'absolute',
    top: '-20%',
    alignItems: 'center',
    zIndex: 3,
  },
  bubble: {
    position: 'absolute',
    zIndex: 2,
  },
  bubbleTextContainer: {
    position: 'absolute',
    zIndex: 3,
    alignItems: 'center',
    top: 200,
  },
  bubbleText: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  bubbleScore: {
    color: 'black',
    textAlign: 'center',
    fontSize: 24,
    top:30,
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  bubbleGoodContainer: {
    backgroundColor: "#8fbc8f",
    padding: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 200,
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleGood: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    height: 50,
    fontFamily: 'MPLUSRounded1c-Regular', // M PLUS Rounded 1c フォントを適用
  },
  meterContainer: {
    width: '80%', // 吹き出しに対して80%の幅に固定
    marginVertical: 10,
    top:10,
    alignItems: 'center',
    position: 'relative',
  },
  meterBackground: {
    width: '100%',
    height: 20,
    top:10,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    backgroundColor: '#76c7c0',
  },
  meterTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meterLabel: {
    fontSize: 16,
    color: 'black',
    fontFamily: 'RocknRollOne-Regular', // RocknRoll One フォントを適用
  },
  characterImage: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 50,
    bottom: 20,
    zIndex: 1,
  },
});