import { StyleSheet } from 'react-native';

export const Global = StyleSheet.create({
    container :{
        backgroundColor: '#FBFBFB',
        shadowColor: 'rgba(0, 0, 0, 0.25)',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 4,
        shadowOpacity: 1
    },
    title: {    
        width: 107,
        height: 39,
        fontFamily: 'Montserrat-Bold',
        fontSize: 32,
        fontWeight: '700',
        fontStyle: 'normal',
        lineHeight: 32,
        color: '#000000',
    },
    titleSecondary: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        height: 20,
        fontWeight: '600',
        fontStyle: 'normal',
        lineHeight: 16,
        color: '#1F1F1F',
        },
    text: {
        height: 14,
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        fontWeight: '500',
        fontStyle: 'normal',
        lineHeight: 100,
        color: '#383838',
    },
    textSecondary: {
        height: 12,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        fontWeight: '400',
        fontStyle: 'normal',
        lineHeight: 100,
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
}
)
;