import { StyleSheet } from 'react-native';

export const Global = StyleSheet.create({
    container :{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position:'relative',
    },
    title: {    
        fontFamily: 'Montserrat-Bold',
        fontSize: 32,
        fontWeight: '700',
        fontStyle: 'normal',
        color: '#000000',
    },
    titleSecondary: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        height: 20,
        fontWeight: '600',
        fontStyle: 'normal',
        color: '#1F1F1F',
        },
    text: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'normal',
        color: '#383838',
    },
    textSecondary: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        color: '#383838',
    },
    input: {
        width: 296,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#FBFBFB',
        borderStyle: 'solid',
        borderWidth: 0.5,
        borderColor: 'rgba(136, 136, 136, 1.0)',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    error: {
        fontWeight: 'bold',
    },
    logo : {
        width: 126,
        height: 109,
    },
    buttonGradient: {

    },
    buttonGradientText: {

    },
    linkText: {    
        textAlign: 'center',
        textDecorationLine: 'underline',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    link:{
       fontWeight: 'bold',
    }
}
)
;