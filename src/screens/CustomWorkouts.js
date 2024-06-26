import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { ScrollView, View, ImageBackground, SafeAreaView } from 'react-native';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getWorkoutByUser } from "../config/DataApp";
import { map } from 'lodash';
import AppLoading from '../components/InnerLoading';
import TouchableScale from 'react-native-touchable-scale';
import { Text, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import LevelRate from '../components/LevelRate';
import LoadMoreButton from '../components/LoadMoreButton';
import NoContentFound from '../components/NoContentFound';
import AsyncStorage from '@react-native-async-storage/async-storage';

const auth = getAuth();

export default function CustomWorkouts(props) {

  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState('');

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const onClickItem = (id, title) => {
    props.navigation.navigate('workoutdetails', {id, title});
  };

  const buttonSearch = () => {
    return (
      <IconButton icon="magnify" size={24} style={{marginLeft:15}} onPress={() => onChangeScreen('searchworkout')}/>
      )
  };

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getWorkoutByUser(auth.currentUser.uid, page+1).then((response) => {

      if (!items) {
        setItems(response);
        setLoading(false);
      }else{
        setItems([...items, ...response]);
        setLoading(false);
      }

      if (response.length <= 0) {
        setshowButton(false);
      }

      setIsLoaded(true);

    });

  };

  const renderButton = () => {
    return (
      <LoadMoreButton
      Indicator={loading}
      showButton={showButton}
      Items={items}
      Num={5}
      Click={() => loadMore()}/>
      )
  }

  useEffect(() => {
    const fetchData = async () => {
      // Fetch workouts by the current user
      const userWorkouts = await getWorkoutByUser(auth.currentUser.uid);

      // Fetch bookmarked workouts from AsyncStorage
      const bookmarkedWorkouts = await AsyncStorage.getItem('workoutsFav');
      const parsedBookmarkedWorkouts = JSON.parse(bookmarkedWorkouts) || [];

      // Merge the user's workouts and bookmarked workouts
      const mergedWorkouts = [...userWorkouts, ...parsedBookmarkedWorkouts];

      // Set the merged workouts as items
      setItems(mergedWorkouts);
      setIsLoaded(true);
    };

    fetchData();
  }, []);

  if (!isLoaded) {
    return (
      <AppLoading/>
    );
  } else {
    return (
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <SafeAreaView>
          <View style={Styles.ContentScreen}>
            {map(items, (item, i) => (
              <TouchableScale key={i} activeOpacity={1} onPress={() => onClickItem(item.id, item.title)} activeScale={0.98} tension={100} friction={10}>
                <ImageBackground source={{uri: item.image}} style={Styles.card3_background} imageStyle={{borderRadius: 8}}>
                  <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={Styles.card3_gradient}>
                    <View style={Styles.card3_viewicon}>
                      {item.rate ? <LevelRate rate={item.rate}/> : null}
                    </View>
                    <Text numberOfLines={2} style={Styles.card3_title}>{item.title}</Text>
                    <Text numberOfLines={2} style={Styles.card3_subtitle}>{item.duration +'  ·  '+ item.level}</Text>
                  </LinearGradient>
                </ImageBackground>
              </TouchableScale>
            ))}
            {renderButton()}
            <NoContentFound data={items}/>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}
