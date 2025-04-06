import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import Icon from "react-native-vector-icons/MaterialIcons";

// Enable layout animation on Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const genreOptions = [
  { name: "Action", id: 1 },
  { name: "Adventure", id: 2 },
  { name: "Comedy", id: 4 },
  { name: "Drama", id: 8 },
  { name: "Fantasy", id: 10 },
  { name: "Horror", id: 14 },
  { name: "Mystery", id: 7 },
  { name: "Romance", id: 22 },
  { name: "Sci-Fi", id: 24 },
  { name: "Sports", id: 30 },
  { name: "Psychological", id: 40 },
];

const Item = ({ item }) => (
  <TouchableOpacity style={styles.item}>
    <Image style={styles.poster} source={{ uri: item.images.jpg.image_url }} />
    <View style={styles.info}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subText}>Episodes: {item.episodes || "?"}</Text>
      <Text style={styles.subText}>Score: {item.score || "N/A"}</Text>
    </View>
  </TouchableOpacity>
);

export default function DiscoverScreen() {
  const [animeList, setAnimeList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [genres, setGenres] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  useEffect(() => {
    fetchTrendingAnime(1);
  }, []);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const fetchTrendingAnime = async (pageNum = 1) => {
    if (!hasNextPage && pageNum !== 1) return;
    setLoading(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${pageNum}`);
      const json = await response.json();
      if (pageNum === 1) {
        setAnimeList(json.data);
      } else {
        setAnimeList((prev) => [...prev, ...json.data]);
      }
      setPage(pageNum);
      setHasNextPage(json.pagination.has_next_page);
    } catch (error) {
      console.error("Failed to fetch trending anime:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSearchResults = async (pageNum = 1) => {
    if (!hasNextPage && pageNum !== 1) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (genres.length > 0) params.append("genres", genres.join(","));
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      params.append("page", pageNum);

      const response = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
      const json = await response.json();
      if (pageNum === 1) {
        setAnimeList(json.data || []);
      } else {
        setAnimeList((prev) => [...prev, ...(json.data || [])]);
      }
      setPage(pageNum);
      setHasNextPage(json.pagination?.has_next_page ?? false);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setPage(1);
    setHasNextPage(true);
    fetchSearchResults(1);
  };

  const handleLoadMore = () => {
    if (loading || !hasNextPage) return;
    const nextPage = page + 1;
    if (isSearching) {
      fetchSearchResults(nextPage);
    } else {
      fetchTrendingAnime(nextPage);
    }
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltersExpanded(!filtersExpanded);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16 }}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Anime..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <TouchableOpacity onPress={toggleFilters} style={styles.filterToggle}>
        <Text style={styles.filterToggleText}>
          {filtersExpanded ? "Hide Filters ▲" : "Show Filters ▼"}
        </Text>
      </TouchableOpacity>

      {filtersExpanded && (
        <View style={styles.filtersContainer}>
          <TouchableOpacity style={styles.input} onPress={() => setStartPickerVisibility(true)}>
            <Text style={{ color: startDate ? "#000" : "#999" }}>
              {startDate ? `Start Date: ${startDate}` : "Select Start Date"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.input} onPress={() => setEndPickerVisibility(true)}>
            <Text style={{ color: endDate ? "#000" : "#999" }}>
              {endDate ? `End Date: ${endDate}` : "Select End Date"}
            </Text>
          </TouchableOpacity>

          <SectionedMultiSelect
            items={genreOptions}
            uniqueKey="id"
            selectText="Choose Genres"
            onSelectedItemsChange={(selectedItems) => setGenres(selectedItems)}
            selectedItems={genres}
            IconRenderer={Icon}
            styles={{
              selectToggle: {
                padding: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 5,
                marginBottom: 10,
              },
            }}
          />
        </View>
      )}

      <Button title="Search" onPress={handleSearch} color="#2D4DA7" />

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setStartDate(formatDate(date));
          setStartPickerVisibility(false);
        }}
        onCancel={() => setStartPickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={(date) => {
          setEndDate(formatDate(date));
          setEndPickerVisibility(false);
        }}
        onCancel={() => setEndPickerVisibility(false)}
      />

      <Text style={styles.sectionTitle}>
        {isSearching ? "Search Results" : "Trending Anime"}
      </Text>

      <FlatList
        data={animeList}
        renderItem={({ item }) => <Item item={item} />}
        keyExtractor={(item) => item.mal_id.toString()}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && <ActivityIndicator size="large" color="#2D4DA7" style={{ marginVertical: 20 }} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterToggle: {
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  filterToggleText: {
    color: "#2D4DA7",
    fontWeight: "bold",
  },
  filtersContainer: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 4,
  },
  item: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
  },
  poster: {
    width: 100,
    height: 140,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    color: "#666",
  },
});
