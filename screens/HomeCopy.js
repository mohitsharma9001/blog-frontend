import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { EvilIcons, FontAwesome } from "@expo/vector-icons";
  import NewsCard from "../components/NewsCard";
  import { useFocusEffect, useNavigation } from "@react-navigation/native";
  import { BASE_URL } from "../constants/Config";
  import axios from "axios";
  import { useSelector } from "react-redux";
  import Header from "../components/Header";
  import { FAB } from "react-native-paper";
  const Home = () => {
    const categories = [
      "All",
      "My blogs",
      "Fashion",
      "Politics",
      "Sports",
      "Tech",
    ];
    const [selectedCategory, setSelectedCategory] = useState("1");
    const navigation = useNavigation();
    const [blogListData, setBlogListData] = useState([]);
    const [blogLatestListData, setBlogLatestListData] = useState([]);
    const [loading, setLoading] = useState(false);
    const isUserLoggedIn = useSelector((state) => state.userAuth || {});
    const [bookmarkedBlog, setBookmarkedBlog] = useState(false);
    const accessToken = isUserLoggedIn.token || null;
    const userData = isUserLoggedIn.user || null;
    const [categoryList, setCategoryListData] = useState([]);
  
    useFocusEffect(
      React.useCallback(() => {
        setLoading(true);
        fetchReportList(selectedCategory);
        fetchLatestBlogList();
        return () => {};
      }, [navigation, selectedCategory])
    );
  
    useEffect(() => {
      fetchCategoryList();
    }, [navigation]);
  
    const fetchReportList = async (selectedCategory) => {
      const reqObj = {
        title: "",
        category: selectedCategory == 1 ? "" : selectedCategory,
      };
      try {
        const response = await axios.post(
          `${BASE_URL}api/v1/blog/blogList`,
          reqObj
        );
        setBlogListData(response?.data?.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching report list:", error);
        throw error;
      }
    };
  
    const fetchCategoryList = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}api/v1/blog/getCategoryList`
        );
        response?.data?.data.unshift({
          _id: "1",
          description: "This includes all categories",
          name: "All",
        });
        setCategoryListData(response?.data?.data);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching report list:", error);
        throw error;
      }
    };
  
    const fetchLatestBlogList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}api/v1/blog/latest-blog`);
        setBlogLatestListData(response?.data.blogs);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching report list:", error);
        throw error;
      }
    };
  
    const bookmarkBlog = async (id) => {
      try {
        const response = await axios.post(
          `${BASE_URL}api/v1/bookmark/bookmark/${id}`
        );
        fetchReportList();
      } catch (error) {
        setLoading(false);
        console.error("Error while bookmark blog:", error);
        throw error;
      }
    };
    const { width } = Dimensions.get("window");
    return (
      <SafeAreaView style={styles.container}>
        <Header
          showProfile={true}
          showSearchComponent={true}
          showRightIcon={true}
          rtIcon={<FontAwesome name="bell-o" size={24} color="black" />}
          profileIconClr={"black"}
        />
  
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
  
        <View style={{ flex: 1, paddingTop: 8, marginTop: 12 }}>
          <FlatList
            data={blogListData.length == 0 ? [1] : blogListData}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[1]}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index = 1 }) => (
              <>
                {index > 0 ? (
                  <NewsCard
                    onPress={() =>
                      navigation.navigate("blogDetails", { blogId: item?._id })
                    }
                    isUserLoggedIn={accessToken}
                    item={item}
                    bookmarkedBlog={bookmarkedBlog}
                    onPressBookmarked={() => bookmarkBlog(item?._id)}
                  />
                ) : (
                  <View style={{ backgroundColor: "white" }}>
                    <FlatList
                      data={categoryList}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                        paddingHorizontal: 12,
                        paddingBottom : 20
                      }}
                      keyExtractor={(item, index) => index}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[
                            styles.categoryItem,
                            selectedCategory === item?._id &&
                              styles.activeCategory,
                          ]}
                          onPress={() => setSelectedCategory(item?._id)}
                        >
                          <Text
                            style={[
                              styles.categoryText,
                              selectedCategory === item?._id && styles.activeText,
                            ]}
                          >
                            {item?.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </>
            )}
            ListHeaderComponent={
              <>
                <View style={{paddingBottom: 8}}>
                  <FlatList
                    data={blogLatestListData}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    horizontal
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    keyExtractor={(item, index) => index}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("blogDetails", {
                            blogId: item?._id,
                          })
                        }
                        activeOpacity={10}
                      >
                        <View style={[styles.card, { width: width * 0.85 }]}>
                          <ImageBackground
                            source={{
                              uri: item?.blogImage,
                            }}
                            style={styles.image}
                            imageStyle={{ borderRadius: 12 }}
                          >
                            <View style={styles.details}>
                              <Text style={styles.author}>
                                {item?.owner.fullName} • {item?.category.name}
                              </Text>
                              <Text style={styles.title}>{item?.title}</Text>
                            </View>
                          </ImageBackground>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </>
            }
          />
        </View>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() =>
            navigation.navigate(accessToken ? "createBlog" : "Profile")
          }
          color="white"
        />
      </SafeAreaView>
    );
  };
  
  export default Home;
  
  const styles = StyleSheet.create({
    container: { backgroundColor: "white", flex: 1 },
    card: {
      // width: "100%",
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#fff",
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5,
      paddingRight: 12,
      marginBottom: 12,
    },
    image: {
      width: "100%",
      height: 180,
    },
    details: {
      flex: 1,
      padding: 12,
      bottom: 0,
      justifyContent: "flex-end",
    },
    author: {
      fontSize: 14,
      color: "white",
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      marginTop: 4,
      color: "white",
    },
    categoryItem: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#ddd",
      marginHorizontal: 5,
      backgroundColor: "#fff",
    },
    activeCategory: {
      backgroundColor: "#FF6347",
      borderColor: "#FF6347",
    },
    categoryText: {
      fontSize: 14,
      color: "#333",
    },
    activeText: {
      color: "#fff",
      fontWeight: "bold",
    },
    fab: {
      position: "absolute",
      margin: 16,
      right: 10,
      bottom: 10,
      backgroundColor: "black",
      color: "white",
      height: 50,
      width: 50,
      alignItems: "center",
      justifyContent: "center",
    },
  });
  