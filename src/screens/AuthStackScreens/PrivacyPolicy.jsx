import React from 'react';
import { View, Text,StyleSheet ,ScrollView} from 'react-native';

const PrivacyPolicy = () => {
  return (
    <ScrollView style={styles.container}  >
        <View  style={styles.title}>
            <Text style={styles.header}>Whaiky</Text>
            <Text style={styles.header}>Privacy Policy.</Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
            Data Protection.
            </Text>
            <Text style={styles.header}>
            Data and privacy.
            </Text>
            <Text style={styles.text}>
            As a member of the Whaiky community, the protection of your personal data is important to us. We value your privacy and make sure that your information is always safe and secure. Therefore, we process your personal data exclusively within the framework of the provisions of the General Data Protection Regulation (GDPR), the Data Protection Act (DSG), and other relevant provisions. In the following, we will inform you about who we are and about the type, scope, and purpose of the processing of your personal data, as well as your rights under data protection law.
            </Text>
            <Text style={styles.header}>
            Clients:
            </Text>
            <Text style={styles.text}>
            Whaiky complies with the European Union's General Data Protection Regulation (GDPR), the highest privacy standard. This gives you control over the management of your personal information. It means you can access and delete the data you choose to store on Whaiky.
            </Text>
            <Text style={styles.header}>
            Service Providers:
            </Text>
            <Text style={styles.text}>
            Whaiky implements various technological and organizational measures to protect your data and guarantee your rights, including the right to access and delete data.
            </Text>
        </View>
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>
            Data Protection.
            </Text>
            <Text style={styles.header}>
            Data and privacy.
            </Text>
            <Text style={styles.text}>
            As a member of the Whaiky community, the protection of your personal data is important to us. We value your privacy and make sure that your information is always safe and secure. Therefore, we process your personal data exclusively within the framework of the provisions of the General Data Protection Regulation (GDPR), the Data Protection Act (DSG), and other relevant provisions. In the following, we will inform you about who we are and about the type, scope, and purpose of the processing of your personal data, as well as your rights under data protection law.
            </Text>
        </View>

    </ScrollView>
  );
}

const styles = {
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  contact: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: 'italic',
  },
    title: {
        alignItems: 'center',
        marginBottom: 50,
    },  
};

export default PrivacyPolicy;
