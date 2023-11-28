import React, { useCallback, useRef, useMemo, useState } from "react";
import { StyleSheet, View, Text, Button, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { shadowStyle } from "../constant/Shadow";

const Test = () => {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
    setIsScrollEnabled(index === 0); 
  }, []);

  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={isScrollEnabled}
    >
      <Button title="Snap To 90%" onPress={() => handleSnapPress(2)} />
      <Button title="Snap To 50%" onPress={() => handleSnapPress(1)} />
      <Button title="Snap To 25%" onPress={() => handleSnapPress(0)} />
      <Button title="Close" onPress={() => handleClosePress()} />
      
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        style={shadowStyle}
      >
        <BottomSheetView style={styles.BottomSheet}>
          <Text>Awesome 🔥</Text>
          <Button title="Close" onPress={() => handleClosePress()} />
        </BottomSheetView>
      </BottomSheet>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#fff",
    paddingTop: 100,
  },
  contentContainer: {
    padding: 24,
  },
  BottomSheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default Test;
