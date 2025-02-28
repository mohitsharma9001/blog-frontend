import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
const SearchComponent = ({
  value,
  onChangeText,
  onClearPress,
  loading,
  searchIconShow,
}) => {
  return (
    <View style={[styles.mainContainer]}>
      <View
        style={[
          styles.searchBarInnerContainer,
          {
            paddingVertical: Platform.OS == "ios"? 8 : 0,
          },
        ]}
      >
        <Ionicons name={"search"} size={20} color={"Black"} />
        <TextInput
          placeholder={"Search"}
          placeholderTextColor={"Black"}
          value={value}
          onChangeText={onChangeText}
          style={[
            styles.searchInput,
            {
              marginHorizontal: 8,
            },
          ]}
        />
      </View>
      {loading ? (
        <ActivityIndicator />
      ) : value?.length > 0 ? (
        <TouchableOpacity>
          <Ionicons name={"close"} size={20} color={"Black"} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SearchComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f1f1",
    borderRadius: 16,
    paddingVertical: 4,
    paddingRight: 12,
    paddingLeft: 12,
    marginHorizontal: 12,
    marginLeft: 12,
    marginRight: 12,
    marginTop: 12,
    marginBottom: 15
  },
  searchBarInnerContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    fontSize: 14,
    fontWeight: 500,
    color: "black",
    flex: 1,
  },
});
