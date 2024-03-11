import React from 'react';
import { View, Modal, StyleSheet,TouchableOpacity,TouchableHighlight,Text ,ScrollView} from 'react-native';
import GradientText from '../components/GradientText';
import Fonts from '../constant/Fonts';
import { SafeAreaView } from 'react-native-safe-area-context';


const TermsModal = ({ visible, onAccept, onClose }) => {
  
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.modalContainer}>
            <Modal  
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            >
            <ScrollView style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Whaiky</Text>
              <Text style={styles.titleSecondary}>Privacy policies.</Text>
            </View>
            <View style={styles.part}>
                  <Text style={styles.titleSecondary}>Data Protection.</Text>
                  <Text style={styles.title}>Data and privacy.</Text>
                  <Text style={styles.text}>
                  As a member of the Whaiky community, the protection of your personal data is important to us. We value your privacy and make sure that your information is always safe and secure. Therefore, we process your personal data exclusively within the framework of the provisions of the General Data Protection Regulation (GDPR), the Data Protection Act (DSG) and other relevant provisions. In the following, we will inform you about who we are and about the type, scope and purpose of the processing of your personal data, as well as your rights under data protection law.
                  </Text>
                  <Text style={styles.title}>Clients:</Text>
                  <Text style={styles.text}>
                  Whaiky complies with the European Union's General Data Protection Regulation (GDPR), the highest privacy standard. This gives you control over the management of your personal information. It means you can access and delete the data you choose to store on Whaiky.
                  </Text>
                  <Text style={styles.title}>Service Providers:</Text>
                  <Text style={styles.text}>
                  Whaiky implements various technological and organizational measures to protect your data and guarantee your rights, including the right to access and delete data.
                  </Text>
            </View>
            <View style={styles.part}>
                <Text style={styles.titleSecondary}>1.1. Who we are (responsible body).</Text>
                <Text style={styles.text}>
                Unless expressly stated in the following sections, Whaiky (internet service) is the entity responsible for the processing of your personal data.
                If you have any questions or need information about data protection at Whaiky, our data protection officer is available at any time. You can contact us by e-mail at Admin@whaiky.com with the subject "Data Protection".
                </Text>
                <Text style={styles.titleSecondary}>1.2. Collection and processing of data.</Text>
                <Text style={styles.text}>      
                We process the personal data you provide to us through your use of our website (including all its subpages) and applications, whether as a customer or a service provider. This covers a range of actions, from simple browsing to posting an advertisement, making enquiries or entering into contracts and communications.
                The purposes of the processing of this data mainly cover the provision of services accessible via www.whaiky.com or the Whaiky application. For your convenience, we offer a variety of services that are organized into different categories:
                </Text>
            </View>
            <View style={styles.part}>
                <Text style={styles.title}>CATEGORIES AND SERVICES.</Text>
                <Text style={styles.text}>
                ● We manage a discount platform where service providers can create time-limited offers to attract the attention of their potential customers. These offers are applicable to all types of services available on Whaiky.
                </Text>
                <Text style={styles.text}>
                ● In the categories of Home Improvement, HVAC, Cleaning, Painting, Moving, among other related services, and through our application, our goal is to provide an Internet platform that allows service providers to present to third parties the solutions that best fit their needs. These services range from home care, maintenance, repairs, pet care, among many others.
                </Text>
                <Text style={styles.text}>
                ● Within the scope of specific high-risk services, such as Electric, Gas, Water, Piping, Heaters, or any service that requires prior knowledge and approval from the relevant authorities in the respective location, we ask our service providers for additional information or documentation to support their ability to provide such services. Since not everyone can provide these types of services, we implement a rigorous data handling process in which our team will personally review these cases, thus providing greater security to customers and their homes.
                </Text>
                <Text style={styles.text}>
                ● Within the scope of the Marketplace, the purpose of automated data processing is to provide a mobile application and internet platform that connects our service providers and customers. We use metrics on the usage of our application to continuously improve the experience of our users in order to increase their satisfaction and optimize the functionality of the platform.
                </Text>
                <Text style={styles.text}>
                ● In addition, data processing is aimed at providing services, addressing problems, and continuously improving our performance. This includes recommending and customizing functions and services, communicating effectively with service providers and customers, operational management, maintaining security, preventing fraud and continuously improving services both on www.whaiky.com and in our mobile applications.
                </Text>
            </View>
            <View style={styles.part}>
                <Text style={styles.titleSecondary}>1.3. What do we use personal data for?</Text>
                <Text style={styles.text}>
                At Whaiky, the use of your personal data is integral to various purposes:
                </Text>
                <Text style={styles.titleThird}>
                Operation of the Application and Platform:
                </Text>
                <Text style={styles.text}>
                ● We use your data to ensure the efficient operation of our application and platform, guaranteeing an optimal experience.
                </Text>
                <Text style={styles.titleThird}>
                Contract Compliance:
                </Text>
                <Text style={styles.text}>
                ● We manage your data to fulfill the contracts established between you and us, ensuring the provision of services and mutual commitments.
                </Text>
                <Text style={styles.titleThird}>
                User Administration:
                </Text>
                <Text style={styles.text}>
                ● We maintain and manage user information, facilitating interaction and providing a personalized experience.
                </Text>
                <Text style={styles.titleThird}>
                Service Provision:
                </Text>
                <Text style={styles.text}>
                ● Your data is essential to provide you with the services you request, ensuring a high level of quality and efficiency in every interaction.
                </Text>
                <Text style={styles.titleThird}>
                Continuous Security Improvement:
                </Text>
                <Text style={styles.text}>
                ● We are constantly working to improve and strengthen the security of our services, using data for this purpose and ensuring your trust in our platform.
                </Text>
                <Text style={styles.titleThird}>
                Relevant Services, Advertising and Marketing Communications:
                </Text>
                <Text style={styles.text}>
                ● We personalize our services, advertisements and marketing communications to make them relevant and beneficial to you.
                </Text>
                <Text style={styles.titleThird}>
                Support Services:
                </Text>
                <Text style={styles.text}>
                ● We use your data to provide you with efficient support services, addressing your needs and providing assistance when you require it.
                </Text>
                <Text style={styles.titleThird}>
                Detection and Prevention of Fraudulent or Illegal Activities:
                </Text>
                <Text style={styles.text}>
                We process personal data to detect, prevent, contain and investigate any fraudulent or illegal activity on our platforms, maintaining a safe and secure environment for all our users.
                In short, the use of your personal data is focused on providing you with a safe, efficient and personalized experience on our Whaiky app and platform.
                </Text>
            </View>
            <View style={styles.part}>
                  <View style={styles.header}>
                      <Text style={styles.title}>2. Data protection.</Text>
                  </View>
                <Text style={styles.title}>2.1. What is personal data?</Text>
                <Text style={styles.text}>
                Personal data is information relating to an identified or identifiable individual. This includes any information that can be used to distinguish or individualize a person, such as names, addresses, telephone numbers, email addresses, location data, online identifiers, financial information, biometric data and more. In short, any data that is directly or indirectly linked to a specific individual is considered personal data. Processing of personal data means the use, collection, recording, storage and disclosure or a combination thereof.
                </Text>
                <Text style={styles.text}>
                Proper protection and management of this data is essential to preserve the privacy and security of individuals. Privacy laws and regulations, such as the General Data Protection Regulation (GDPR) in the European Union, set strict guidelines on how personal data should be processed and protected.
                </Text>
                <Text style={styles.title}>2.2. How do we receive personal information about you?</Text>
                <Text style={styles.text}>
                We receive personal data in a number of ways, primarily when you create an account or profile on one of our platforms, whether from our mobile application, subpages or our web platform. Depending on the information you are seeking within these, you will be asked to complete a corresponding form.
                2.2.1. Personal information you provide to us.
                When you register on our platform, you provide us with certain personal information about yourself, such as your first name, last name, gender, address, telephone number or email address. The only mandatory information is your name, telephone number and email address. This information is stored in our databases to provide the service you have requested, improve our services and prevent fraud. 
                </Text>
                <Text style={styles.bold}>If you do not wish to provide the mandatory information, registration on our platform is not possible.
                </Text>
                <Text style={styles.text}>
                We also store information when you communicate with us, for example, when you send us an email to request assistance or use the contact form, so that we can answer your questions.
                </Text>
                <Text style={styles.text}>
                We also process the personal data you generate when you place an advertisement, make enquiries to the advertiser and communicate with us. We also process the data you enter when you update your account, your ad, bid and chat.
                </Text>
                <Text style={styles.title}>
                2.2.2 Data we collect in our records.
                </Text>
                <Text style={styles.text}>
                When registering on our application or web platform, a single initial profile will be created for both service providers and customers. This process involves completing a basic form where you can enter your email, phone number or other means of contact of your choice.
                </Text>
                <Text style={styles.text}>
                For those who wish to become service providers, we manage a division in the forms. If your service is basic and does not require special certifications, such as house cleaning, green area maintenance, among others, the registration process will be simple. You will only need to fill in the necessary information to create your profile, which will be visible to customers.
                </Text>
                <Text style={styles.text}>
                However, if your services involve risks and require specific knowledge, backed by certifications or previous experience, such as electrical, gas, plumbing, etc., a review process will be applied by our team at Whaiky. In order to be able to offer this type of services, you will need to demonstrate your ability through a special form that will be evaluated by our team before final approval. This procedure ensures quality and safety in the provision of specialized services.
                </Text>
                <Text style={styles.bold}>
                If you do not wish to provide the mandatory information, registration on our platform is not possible and therefore you will not be able to provide the desired service. This only applies to the risk services we have already mentioned, excluding the basic services in this Note.
                </Text>
                <Text style={styles.title}>
                2.2.3. Personal information collected through use of the Services.
                </Text>
                <Text style={styles.text}>
                We collect information about your interaction with our services. When you use our services, we record information about the advertisements you post or view, the services you use and how you use them. This practice enables us to continually improve our services, prevent fraud and customize content and ads to your preferences.
                </Text>
                <Text style={styles.bold}>
                The information collected is classified into the following types:
                </Text>
                <Text style={styles.boldListElement}>
                ● Technical information about your device and your internet connection.
                </Text>
                <Text style={styles.text}>
                We use server logs and other tools to collect information about the device used and the connection to our services, such as operating system, browser version, IP addresses or cookies.
                </Text>
                <Text style={styles.text}>
                Example of use: We adapt the display of our services to the device you are using, for example to access the mobile version of Whaiky when using a mobile phone.
                </Text>
                <Text style={styles.boldListElement}>
                ● Information we process when you use our services.
                </Text>
                <Text style={styles.text}>
                When you use our Services, this activity is automatically detected by our measurement tools. We use this information to, among other things, improve our services and provide content tailored to your usage.
                </Text>
                <Text style={styles.text}>
                Example use case: we collect search history to see which ads are being viewed. If you are logged in to the app, we use this information to show you recent searches because we believe they are relevant to you.
                </Text>
                <Text style={styles.boldListElement}>
                ● Location information.
                </Text>
                <Text style={styles.text}>
                Most mobile devices allow you to send location information and geolocation data or determine your location based on this technology. In most cases, you can enable or disable the feature through your device settings. Only if you agree to share your location in our apps, your GPS location will be processed through the use of the apps.
                </Text>
                <Text style={styles.text}>
                Example of use: In the app you can use the area finder and have ads sorted by distance from your location. This is practical, increases convenience and, if you wish, shows you ads in your area.
                </Text>
                <Text style={styles.boldListElement}>
                ● MobileDeviceCameraAccess.
                </Text>
                <Text style={styles.title}>
                1.Consent for Access to the Chamber:
                </Text>
                <Text style={styles.text}>
                When you install and use our app, we will request your consent to access your device's camera. Please be sure to review and agree to our permission requests to ensure a complete and safe experience.
                </Text>
                <Text style={styles.title}>
                2.Purpose of Access to the Chamber:
                </Text>
                <Text style={styles.text}>
                Access to the camera will be requested for the specific purpose of capturing photos to personalize your profile, creating offers with photos of the service, uploading

                documents to the platform to offer the services mentioned above in our privacy policy (2.2.2 Data we collect in our records) to show your potential clients the work you do or "record videos for specific functions of the application or services. We will not use the camera for purposes other than those stated.
                </Text>
                <Text style={styles.title}>
                3. Storage and Access to Captured Images or Videos:
                </Text>
                <Text style={styles.text}>
                Images or videos captured through the camera may be stored locally on your device and/or on the application's secure servers. We guarantee that only those authorized will have access to this information.
                </Text>
                <Text style={styles.title}>
                4. Data Sharing and Data Transfer:
                </Text>
                <Text style={styles.text}>
                We will not share or transfer captured images or videos to third parties without your explicit consent, unless we are legally obliged to do so.
                </Text>
                <Text style={styles.title}>
                5. Security:
                </Text>
                <Text style={styles.text}>
                We implement security measures to protect the privacy of captured images or videos. This includes the use of encryption and other industry standard security practices.
                </Text>
                <Text style={styles.title}>
                6. Duration of Storage:
                </Text>
                <Text style={styles.text}>
                Captured images or videos will be stored for as long as Whaiky deems appropriate, or as long as the user requests, after which time they will be deleted from our systems.
                </Text>
                <Text style={styles.title}>
                7. User Rights:
                </Text>
                <Text style={styles.text}>
                You have the right to access, modify or delete captured images or videos. You can manage these settings from the application settings.
                </Text>
                <Text style={styles.title}>
                8. Revocation of Access to the Chamber:
                </Text>
                <Text style={styles.text}>
                You can revoke our application's access to the camera at any time through your device's settings.
                </Text>
            </View>
            <View style={styles.part}>
                <Text style={styles.title}>2.3. How do we use information about you?</Text>
                <Text style={styles.text}>
                We use the personal information we collect to provide, analyze and improve our services. To increase the security of our platform and to give you the best possible experience. We also use pseudonymised data to create advertising target groups.
                </Text>
                <Text style={styles.text}>
                Whaiky is constantly working to provide you with the best possible experience of our services.
                </Text>
                <Text style={styles.text}>
                To do this we use personal data...
                </Text>
                <Text style={styles.title}>
                2.3.1. offering you our services in an optimal way.
                </Text>
                <Text style={styles.text}>
                Whaiky processes personal data and other forms of data to provide the services agreed with you. We also use data to ensure the best possible user experience, automatic login, personalisation of the content view of your screen and fast loading of pages.
                </Text>
                <Text style={styles.title}>
                2.3.2. ...to create statistics and market trends.
                </Text>
                <Text style={styles.text}>
                Whaiky uses data to create statistics and market trends in order to continuously improve our users' experience and optimize our service offerings. The collection of anonymous and aggregated information allows us to better understand the general preferences and behaviors of our users.
                </Text>
                <Text style={styles.text}>
                This information helps us to:
                </Text>
                <Text style={styles.paddingLeft}>
                Improve User Experience: We analyze behavioral patterns to adjust and personalize the platform, providing a more relevant and satisfying experience for each user.
                </Text>
                <Text style={styles.paddingLeft}>
                Optimize Service Offering: Understanding market trends allows us to adapt and expand our service offering, ensuring we are aligned with the changing needs of our users.
                </Text>
                <Text style={styles.paddingLeft}>
                Make Informed Decisions: Creating statistics provides us with valuable information for strategic decision making and future application development, ensuring we are at the forefront of market expectations.
                </Text>
                <Text style={styles.title}>
                2.3.3. ... to personalize services.
                </Text>
                <Text style={styles.text}>
                We want to offer you a unique experience tailored to your individual preferences. In order to personalize our services, we use data related to your user behavior and preferences. By analyzing how you interact with our platform, we can better understand your needs and desires.
                </Text>

                <Text style={styles.title}>
                This approach allows us to:
                </Text>
                <Text style={styles.boldListElement}>
                ● Personalized Content: We use your data to provide you with content that
                aligns directly with your interests and preferences.
                </Text>
                <Text style={styles.boldListElement}>
                ● Targeted Recommendations: By learning about your user behavior, we can make more accurate and relevant recommendations about services and features that might be useful or appealing.
                </Text>
                <Text style={styles.boldListElement}>
                ● Personalized Experience: We seek to create a personalized experience for each user, providing services tailored to their individual expectations.
                It is essential to emphasize that this process is carried out in a secure manner and with respect for your privacy. We strive to be transparent in the use of your data and ensure that your information is handled as confidentially as possible. At Whaiky, our goal is to provide services that meet your needs in a precise and personalized manner.
                </Text>
                <Text style={styles.title}>
                2.3.4. ... Display and measure relevant advertising.
                </Text>
                <Text style={styles.text}>
                We want to ensure that the ads you see are relevant and useful to you, and also to measure the effectiveness of our advertising campaigns. To achieve this, we use information relating to you and your user behavior on our platform.
                </Text>
                <Text style={styles.text}>
                This approach allows us to:
                </Text>
                <Text style={styles.boldListElement}>
                ● Relevant Ads: We use data about your preferences and behaviors to show you ads that align with your interests and needs, providing a more meaningful advertising experience.
                </Text>
                <Text style={styles.boldListElement}>
                ● Effectiveness Measurement: We analyze how you respond to different ads to evaluate their effectiveness and continually improve our advertising strategies.
                </Text>
                <Text style={styles.boldListElement}>
                ● Frequency Control: The information we have allows us to control how often a particular ad is shown to you. We avoid repeatedly presenting you with the same offers, ensuring a balanced and non-intrusive advertising experience.
                </Text>
                <Text style={styles.title}>
                2.3.5.... for sending email marketing and newsletters.
                </Text>
                <Text style={styles.text}>
                If you are a registered user and maintain an active relationship with us, you will receive fascinating details about our services, offers, news and more by email. Should you wish to explore in depth what Whaiky has to offer, we will send you this valuable information. In all other cases, we will only send our newsletters with your express consent. In addition, we give you the freedom to unsubscribe at any time with just one click on each newsletter.
                </Text>
                <Text style={styles.title}>
                2.4.On what legal basis do we process your personal data?
                </Text>
                <Text style={styles.boldListElement}>
                ● Pre-contractual measures, acceptance and fulfillment of the contract in accordance with Article 6(1)(b) of the GDPR, so that we can, for example, process your enquiry or order.
                </Text>
                <Text style={styles.boldListElement}>
                ● Consent in accordance with Article 6(1) of the GDPR as part of registration.
                </Text>
                <Text style={styles.boldListElement}>
                ● Legal obligation pursuant to Article 6(1)(c) of the GDPR, e.g. to store order
                documents or invoices (business correspondence).
                </Text>
                <Text style={styles.boldListElement}>
                ● Legitimate interest pursuant to Article 6(1)(f) of the GDPR, in particular for marketing and advertising.
                </Text>
            </View>
            <View style={styles.part}>
            <Text style={styles.title}>2.5. How long do we store your personal data?</Text>
            <Text style={styles.text}>
            Whaiky is committed to preserving the confidentiality and security of your personal data. We will keep such information only for as long as is necessary to fulfill the above purposes, provide the services requested or booked, and comply with other legal obligations. This includes resolving disputes and defending our legal position and enforcing our general terms and conditions.
            </Text>
            <Text style={styles.text}>
            When personal data is no longer relevant for the stated purposes and there are no longer any retention requirements, we will delete or anonymise it. Various factors can influence the retention period, such as the existence of an active Whaiky account, booked services (including additional payments) and communication related to concluded contracts.
            </Text>
            <Text style={styles.text}>
            The type of data also plays a crucial role in the retention period. For example, we are legally obliged to retain contractual documents and invoices for a period of 7 years. At all times, we strive to ensure that your personal data is handled responsibly and in accordance with the applicable regulations.
            </Text>
            <Text style={styles.title}>
            2.6. What personal data do we share with whom?
            </Text>
            <Text style={styles.bold}>
            Courts, authorities and legally authorized third parties.
            </Text>
            <Text style={styles.text}>
            If a crime is suspected in connection with the use of Whaiky's services, information may be disclosed to law enforcement upon request.
            </Text>
            <Text style={styles.text}>
            We will not share, sell or transfer personal information except as described in this Privacy Policy.
            </Text>
            <Text style={styles.text}>
            To comply with legal obligations, enforce our Terms and Conditions, defend legal claims that an advertisement or other content on our sites or services may violate the rights of third parties, or to protect the rights, property or safety of others, we may collect personal data and transmit it to third parties.
            </Text>
            <Text style={styles.text}>
            In addition, for example, under the Security Police Act and the Code of Criminal Procedure, we may be obliged to provide personal data to law enforcement authorities in connection with an investigation or suspicion of a criminal offense, an illegal act or other act that could result in legal action for you, you or another user may arise liability.
            </Text>
            <Text style={styles.text}>
            In this case, unless required by law, we will limit disclosure for the purposes of the investigation to the data we deem necessary.
            </Text>
            <Text style={styles.text}>
            We will also disclose personal data to authorized third parties under the E-Commerce Act within the scope of the legal obligation and to the extent permitted by law.
            </Text>
            <Text style={styles.title}>
            2.7. What rights do you have as a data subject under data protection law?
            </Text>
            <Text style={styles.text}>
            As a data subject, you have rights that are different from those of the data controller. These rights serve to ensure transparency in the processing of personal data. As a data subject, you should be able to inform yourself and also know whether we process your personal data, how, in what way and why.
            </Text>
            <Text style={styles.title}>
            Right to information.
            </Text>
            <Text style={styles.text}>
            As a data subject, you have the right to receive information from us at any time about the personal data stored about you.
            </Text>
            <Text style={styles.title}>
            Right of rectification.
            </Text>
            <Text style={styles.text}>
            As a data subject, you have the right to request that we immediately correct inaccurate personal data concerning you. It is important that the personal information we hold about you is accurate and up to date. If you notice any errors, we recommend that you correct them yourself in your user profile. If you are unable to do this, please contact us so that we can correct your information.
            </Text>
            <Text style={styles.title}>
            Right to erasure (right to be forgotten).
            </Text>
            <Text style={styles.text}>
            As a data subject, you have the right to have your personal data deleted immediately, unless there is a reason that prevents its deletion.
            </Text>
            <Text style={styles.title}>
            Right to restriction of processing.
            </Text>
            <Text style={styles.text}>
            As a data subject, you have the right to request that we, as the responsible body, restrict processing if there is no compelling reason not to do so.
            </Text>
            <Text style={styles.title}>
            Right to data portability (data portability).
            </Text>
            <Text style={styles.text}>
            As a data subject, you have the right to receive the personal data you have provided to us in a structured, common and machine-readable format. You also have the right to have us transmit this data to another responsible person, provided that the processing is based on consent in accordance with Art. 6 para. 1 letter a) GDPR or Art. 9 para. 2 letter a) GDPR or with a contract in accordance with Art. 6 para. 1 letter b) GDPR and the processing is carried out by automated procedures, unless the processing is necessary for the performance of a task which is in the public interest or in the exercise of a public authority vested in the responsible person.
            </Text>
            <Text style={styles.title}>
            Right to object.
            </Text>
            <Text style={styles.text}>
            If processing is based on consent, you, as the data subject, have the right to withdraw your consent at any time. This means that we can no longer process your data unless there is another lawful basis for lawful processing. Such revocation does not affect the lawfulness of the processing carried out on the basis of the consent prior to its revocation. If we process your personal data for the purpose of direct marketing, you, as the data subject, have the right to object at any time to the processing of your personal data for the purpose of such marketing; in this case, there is no balancing of interests.
            </Text>
            <Text style={styles.title}>
            Exercise of the rights of the persons concerned.
            </Text>
            <Text style={styles.text}>
            In order not to jeopardize the rights of third parties, we must ensure that the data subject's rights are exercised only by the data subject. To ensure this, you must identify yourself and participate in the identification process.
            </Text>
            <Text style={styles.text}>
            If you believe that your personal data is not lawfully processed, we will be pleased if you first contact us directly at Admin@whaiky.com. Irrespective of this, you have the right to lodge a complaint with the data protection authority as the responsible supervisory authority at https://www.dsb.gv.at/aufgaben-taetigkeiten/gesetzesbegutachtungen.html.
            </Text>
            <Text style={styles.title}>
            2.8. Analysis tools used.
            </Text>
            <Text style={styles.text}>
            We use analytics tools to collect information about how our services are used. For example, we measure the number of visitors, which pages are visited, how long a visit lasts and the like. User and traffic statistics are used in aggregate form, so the statistics do not contain any information that can be linked to you as an identified individual. However, service usage information is linked to personal information in certain contexts to provide you with good customer service and targeted communication. IP addresses and location data are used to compile statistics based on geographical criteria.
            </Text>
            <Text style={styles.title}>
            2.9. Special information on children's privacy.
            </Text>
            <Text style={styles.text}>
            At Whaiky, we value and respect the privacy of our users, and therefore, we do not seek to collect or process personal data from persons under the age of 14. In the event that we become aware that we have inadvertently been provided with personal information from children under the age of 14, we will take immediate steps to delete such information. Our priority is to ensure a safe and secure environment in compliance with privacy laws and the welfare of young people online.
            </Text>
            <Text style={styles.title}>
            2.10. Changes to the privacy policy.
            </Text>
            <Text style={styles.text}>
            We remain committed to transparency by regularly updating our privacy policy to reflect any changes to our services. In the event of updates, the new policy will be posted on both our website and app prior to implementation. In addition, we will provide you with detailed information about the changes and how they affect the relevant services. Your understanding and trust is paramount, and we strive to keep you informed of any changes that may affect your experience with us.
            </Text>
            </View>
            <View style={styles.part}>
              <View style={styles.header}>
                <Text style={styles.title}>3. Cookies.</Text>
              </View>
                <Text style={styles.title}>
                3.1. Why do we use cookies?
                </Text>
                <Text style={styles.text}>
                We use cookies to provide you with relevant information when you visit our website and mobile application or use our services.
                </Text>
                <Text style={styles.text}>
                We also use cookies to simplify and improve our services and to measure data traffic and create statistics.
                </Text>
                <Text style={styles.text}>
                In addition, we may also use third party cookies to measure and analyze traffic and use visitor behavior on our websites to create target groups for marketing purposes or to improve the functionality of the Services.
                </Text>
                <Text style={styles.title}>
                3.2. types of cookies.
                </Text>
                <Text style={styles.text}>
                There are different types of cookies that can be classified in different ways.
                </Text>
                <Text style={styles.title}>
                3.2.1. After expiry (validity).
                </Text>
                <Text style={styles.boldListElement}>
                ● Transient cookies (session cookies) : they only contain data from your current visit. When you end your browser session, these cookies will be deleted from your device. For example, if you close all open browser windows or turn off your device completely, session-based cookies are automatically deleted.
                </Text>
                <Text style={styles.boldListElement}>
                ● Persistent cookies : these cookies are automatically deleted after a specific period of time, which may vary depending on the cookie. You can delete cookies at any time in your browser settings (see 3.4. Managing cookies through your web browser in our privacy policies).
                </Text>
                <Text style={styles.title}>
                3.2.2. By cookie creator.
                </Text>
                <Text style={styles.boldListElement}>
                ● First-party cookies : these are set directly by Whaiky itself. This allows us to ensure that the website and mobile application work as they should and provide the best possible experience for you as a user.
                </Text>
                <Text style={styles.boldListElement}>
                ● Third-party cookies : these are not set by Whaiky, but by another provider. The third party, usually an advertiser, may use such cookies to track a user's visits to all pages on which the third party's advertising is displayed, for example also on Whaiky's pages. The website you are currently visiting does not influence the third-party vendors and their cookies; they also change, depending on the advertising material. Some browsers allow you to specifically block third-party cookies.
                </Text>
                <Text style={styles.text}>
                ● We also use third-party cookies: to measure and analyze traffic and usage of our websites, understand browsing behavior, create audiences for marketing purposes, facilitate ad management and improve the functionality of our websites and services.
                </Text>
                <Text style={styles.title}>
                3.2.3. According to intended use.
                </Text>
                <Text style={styles.boldListElement}>
                ● Functionality cookies : these cookies are necessary to be able to fully use our services and their functionalities. This can be, for example, saving your entries in form fields (so that you do not have to fill them in several times) or saving your geographical location or saving user settings. The information collected by functionality cookies relates only to the website visited, but no information is collected about browsing on other websites. Rejecting these cookies may mean that the full range of functions may not be available to you.
                </Text>
                <Text style={styles.boldListElement}>
                ● Performance or web analytics cookies : these cookies collect information about the usage habits of visitors to a website or application in an anonymous form, i.e. without it being possible to draw conclusions about the individual user. This information could be, for example, at what time the most access occurs or which (sub)pages are visited most frequently. This information is summarized and evaluated using web analytics or performance tools in order to obtain information about the use, functionality and usability of websites or applications and to be able to continuously develop them.
                </Text>
                <Text style={styles.text}>
                Consequently, these cookies are important to improve the quality of our services. These cookies are also used to analyze the number of visits or pages viewed and other indicators of the performance of websites or applications or certain content (e.g. advertisements).
                ● Marketing/advertising : these cookies are used to draw conclusions about your interests and needs based on an analysis of users' browsing behavior and to be able to segment users with the same or similar interests and needs (target groups). On this basis, advertising can be directed to users assigned to a specific target group (targeting). This is usually done
                by means of tools provided by special service providers (e.g. ad servers for marketing online advertising space; data management platforms for managing user data).
                </Text>
                <Text style={styles.text}>
                These cookies are also used to control (in particular, limit) the frequency of advertisements and measure the impact or efficiency of campaigns. Cookies from third-party vendors may also be used by advertising networks, which they use in connection with their services. These cookies determine whether the user has visited a website and transmit this information to third parties, where it can be linked to functionality provided by other organizations. In addition, special targeting cookies allow advertising to be sent to users of social networks.
                </Text>
                <Text style={styles.boldListElement}>
                ● Social media cookies: Social media plugins are integrated into the desired pages to be able to recommend and share ads on social networks, such as Facebook, Instagram, Google +. We use a two-step process for this. Data will only be passed on to third parties when you, as a user, click on one of the icons displayed in the social media bar. Whaiky has no influence on the cookies set by Facebook, Instagram, Google+, etc., nor does Whaiky have access to them.
                </Text>
                <Text style={styles.title}>
                3.3. Consent Management Platform (CMP).
                </Text>
                <Text style={styles.text}>
                When using the Consent Management Platform (CMP) on our website, in addition to the configuration options in your web browser, specifically for our services, you can allow or reject cookies according to the following categories:
                </Text>
                <Text style={styles.boldListElement}>
                ● Adselection,placementandevaluation.
                Collect information and combine it with previously collected information to select, display ads, evaluate the placement and effectiveness of these ads. This includes using previously collected information about your interests to select ads, process data about which ads were shown, how often they were shown, when and where they were shown, and whether you took an action on the ad, such as clicking on it once. This does not include personalization, which is the collection and processing of information about your use of this service to then personalize advertising and/or content in other contexts.
                </Text>
                <Text style={styles.boldListElement}>
                ● Content selection, placement and evaluation.
                Collecting information and linking to previously collected information to select and place content for you and to evaluate the placement and effectiveness of this content. This includes using previously collected information about your interests to select content, process data about what content was displayed, how often it was displayed, when and where it was displayed, and whether
                you took any action on the content, such as clicking on it or content. This does not include personalization, which is the collection and processing of information about your use of this service to then personalize content and/or advertising over time in other contexts, such as websites or applications.
                </Text>
                <Text style={styles.boldListElement}>
                ● Evaluation
                Collect information about your use of the Content and combine it with previously collected information that is used to evaluate, understand and report on your use of the Service. This does not include personalization, which is the collection and processing of information about your use of this service to then provide you with content and/or advertising in other contexts, i.e., on other services such as websites or applications, which are personalized over time.
                </Text>
                <Text style={styles.boldListElement}>
                ● Customization
                The collection and processing of information about your use of this service to then customize advertising and/or content for you in other contexts, such as on other websites or applications, over time. Site or application content is generally used to allow us to draw conclusions about your interests, which will guide future advertising and/or content selection.
                </Text>
                <Text style={styles.boldListElement}>
                ● Storage and access to information.
                Storing or accessing information already stored on your device, such as advertising identifiers, device identifiers, cookies and similar technologies.
                </Text>
                <Text style={styles.title}>
                3.4. Cookie management through the web browser.
                </Text>
                <Text style={styles.text}>
                You can choose whether or not to accept cookies through your browser settings. Here you can usually indicate whether you accept cookies from the websites you visit, from third parties connected to the websites and, if you wish, you will be notified each time a new cookie is stored.
                </Text>
                <Text style={styles.text}>
                The exact procedure depends on your device and the browser used. If you do not want cookies to be stored on your computer, you can prevent this by changing your browser settings. There are also special services that you can install as an add-on in your browser to manage or block cookies.
                </Text>
                <Text style={styles.bold}>
                Please note: Whaiky's services are provided to you largely free of charge. This is also based on funding from advertising revenue. If you block advertising on Whaiky, it will be more difficult for us to continue to provide free services.
                </Text>
                <Text style={styles.bold}>
                Please note: If you disable Whaiky's local storage of cookies, this may, for example, prevent our website and services from working as intended. You may also have to login each time.
                </Text>
                <Text style={styles.text}>
                Despite implementing legally compliant technical and organizational measures, it will not be possible in all cases to communicate a revocation to the cookie provider prior to further processing of cookies.
                </Text>
                <Text style={styles.text}>
                You can find out how you can manage cookies in different browsers here:
                </Text>
                <View style={styles.browserList}>
                    <Text style={styles.listElement}>
                    ● Mozilla FireFox
                    </Text>
                    <Text style={styles.listElement}>
                    ● Internet Explorer
                    </Text>
                    <Text style={styles.listElement}>
                    ● Google Chrome
                    </Text>
                    <Text style={styles.listElement}>
                    ● Ópera
                    </Text>
                    <Text style={styles.listElement}>
                    ● Safari
                    </Text>
                </View>
                <Text style={styles.text}>
                If you have any questions or information about data protection at Whaiky, our data protection officer is at your disposal at any time with the added "data protection" email to Admin@whaiky.com.
                </Text>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity 
              style={styles.shadowWrapper} 
              onPress={onClose}
              >
              <View style={styles.btn} >
              <GradientText colors={['#9E41F0', '#189DA2']} style={styles.btnText}
                size={25}
                >
                  Disagree
                </GradientText>
              </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shadowWrapper}  onPress={onAccept}>
              <View style={styles.btn}>
              <GradientText colors={['#9E41F0', '#189DA2']} style={styles.btnText}
                size={25}
                >
                  Agree
                </GradientText>
              </View>
              </TouchableOpacity>
            </View>
            </ScrollView>
            </Modal>
    </View>
    </SafeAreaView>
  );
};

export default TermsModal;

const styles = StyleSheet.create({
    modalContainer: {
      backgroundColor: '#FBFBFB',
    },
    container: {
      flex: .5,
      backgroundColor: '#FBFBFB',
      padding: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#090909',
      marginTop: 16,
      fontFamily: Fonts.primary,
    },
    titleSecondary: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#090909',
      marginTop: 16,
      fontFamily: Fonts.primary,
    },
    titleThird: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#090909',
      marginTop: 16,
      fontFamily: Fonts.primary,
    },
    text: {
      fontSize: 14,
      color: '#090909',
      marginTop: 5,
    },
    bold: {
      fontSize: 14,
      color: '#090909',
      marginTop: 16,
      fontWeight: 'bold',
    },
    boldListElement: {
      fontSize: 14,
      color: '#090909',
      marginTop: 16,
      fontWeight: 'bold',
      marginLeft: 20,
    },
    listElement: {
      fontSize: 14,
      color: '#090909',
      margin: 8,
    },
    header: {
      borderBottomWidth: 1,
      borderBottomColor: '#090909',
      marginBottom: 10,
    },
    part: {
      marginBottom: 20,
    },
    browserList: {
      marginTop: 10,
    },
    btnContainer: {
      alignItems: 'center',
      marginTop: 20,  
      flexDirection: 'row',
      marginBottom: 50,
      width: '100%',
      justifyContent: 'space-around',
      gap:50,
    },
    btn: {
      borderRadius: 15,
      paddingHorizontal: 10,
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
    },
    btnText: {
      fontSize:25,
      textAlign:'center',
      color:'#9E41F0',
    },
  });