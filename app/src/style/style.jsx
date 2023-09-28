import { StyleSheet } from "react-native";
export const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 20
    },
    button:{
        backgroundColor: "#9E41F0",
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: 200
    },
    textWelcome: {
        color: '#FFF',
        textAlign: 'center',
        fontFamily: 'Arial Rounded MT Bold', 
        fontSize: 36,
        fontStyle: 'normal',
        fontWeight: '400',
        
      },
        text: {
            color: '#FFF',
            fontFamily: 'Inter',
            fontSize: 20,
            fontStyle: 'normal',
            fontWeight: '300',
        },
});