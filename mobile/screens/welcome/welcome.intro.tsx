import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import {
  Nunito_400Regular,
  Nunito_600SemiBold,
} from "@expo-google-fonts/nunito";
import { useFonts, Raleway_700Bold } from "@expo-google-fonts/raleway";
import { LinearGradient } from "expo-linear-gradient";
import AppIntroSlider from "react-native-app-intro-slider";
import { onboardingSwiperData } from "@/constants/constans";
import { router } from "expo-router";

export default function WelcomeIntroScreen() {
  let [fontsLoaded, fontError] = useFonts({
    Raleway_700Bold,
    Nunito_400Regular,
    Nunito_600SemiBold,
  });

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const renderItem = ({ item, index }: { item: onboardingSwiperDataType, index: number }) => (
    <LinearGradient
      colors={["#302fc1", "#302fc1", "#302fc1"]}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        {/* Background Image*/}
        <View style={{ flex: 0.6, justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            source={item.image}
            resizeMode="contain"
            style={{
              width: Dimensions.get('window').width,
              height: '100%',
            }}
          />
        </View>

        {/* Content Container */}
        <View style={{ 
          flex: 0.4,
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}>
          <View style={{
            alignItems: 'center',
          }}>
            {/* Title */}
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: '#FFFFFF',
              textAlign: 'center',
              fontFamily: "Raleway_700Bold",
              lineHeight: 32,
              marginBottom: 16,
            }}>
              {item.title}
            </Text>

            {/* Description */}
            <Text style={{
              fontSize: 16,
              color: '#E8EAFF',
              textAlign: 'center',
              lineHeight: 24,
              paddingHorizontal: 10,
              fontFamily: "Nunito_400Regular",
              marginBottom: 24,
            }}>
              {item.description}
            </Text>

            {/* Pagination Dots */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {onboardingSwiperData.map((_, dotIndex) => (
                <View
                  key={dotIndex}
                  style={{
                    backgroundColor: dotIndex === index ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                    width: dotIndex === index ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    marginHorizontal: 4,
                  }}
                />
              ))}
            </View>
          </View>

          {/* Buttons */}
          <View style={{
            gap: 16,
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#FFFFFF',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
                width: '100%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => router.push("/login")}
            >
              <Text style={{
                color: '#6B73FF',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: "Nunito_600SemiBold"
              }}>
                Sign in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 16,
                alignItems: 'center',
                width: '100%',
              }}
              onPress={() => router.push("/login")}
            >
              <Text style={{
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '600',
                fontFamily: "Nunito_600SemiBold"
              }}>
                Continue without signing in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <View style={{ flex: 1 }}>
      <AppIntroSlider
        renderItem={renderItem}
        data={onboardingSwiperData}
        onDone={() => {
          router.push("/login");
        }}
        onSkip={() => {
          router.push("/login");
        }}
        renderNextButton={() => null}
        renderDoneButton={() => null}
        showDoneButton={false}
        showNextButton={false}
        dotStyle={{ display: 'none' }}
        bottomButton={false}
        activeDotStyle={{ display: 'none' }}
      />
    </View>
  );
}