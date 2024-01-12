import { Platform } from 'react-native';

const shadowStyle = {
    ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.25,
            shadowRadius: 1.5,
        },
        android: {
            elevation: 5,
        },
    }),
};

export { shadowStyle };
