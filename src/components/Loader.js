import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import { StyleSheet,View } from "react-native"
import { shadowStyle } from "../constant/Shadow"
const Loader = (props) => (
    <View style={styles.container}>
        <ContentLoader viewBox="0 0 100 100"
            width={100} 
            height={100}
            style={{width:'100%',justifyContent:'center',alignItems:'center'}}
        >
            <Circle cx="30" cy="30" r="30" />
            <Rect x="80" y="5" rx="4" ry="4" width="300" height="13" />
            <Rect x="80" y="40" rx="3" ry="3" width="300" height="10" />
        </ContentLoader>
  </View>
  )
  

export default Loader

const styles = StyleSheet.create({
    container: {
        borderWidth:1,
        borderRadius:10,
        borderColor:'#ccc',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        ...shadowStyle,
        padding:10
        },

    });