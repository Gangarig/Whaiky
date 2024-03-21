const SearchBox = ({ searchTerm, setSearchTerm }) => {
    return (
      <View style={styles.searchBox}>
        <Text style={[Global.titleSecondary, styles.searchLabel]}>
          Search with / Post Title or Poster Name /.
        </Text>
        <View style={styles.searchTextInputWrapper}>
          <TextInput
            placeholder="Search"
            style={Global.input}
            onChangeText={(text) => setSearchTerm(text)}
            value={searchTerm}
            placeholderTextColor={theme.gray}
          />
        </View>
      </View>
    );
  };
  

  const LoadMoreButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.loadMoreBtn} onPress={onPress}>
        <Text>Load More</Text>
      </TouchableOpacity>
    );
  };

  const PostCardList = ({ posts, navigateToPostDetail }) => {
    return (
      <FlatList
        data={posts}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToPostDetail(item.id)}>
            <PostCard 
              owner={item.ownerName} 
              postTitle={item.title} 
              postImageSource={item.images && item.images.length > 0 ? item.images[0] : null}
              onPress={() => navigateToPostDetail(item.postId)}
            />
          </TouchableOpacity>
        )}
      />
    );
  };
  