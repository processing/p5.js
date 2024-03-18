# स्टीवर्ड दिशानिर्देश

चाहे आप हाल ही में हमारे साथ स्टीवर्ड के रूप में शामिल हुए हों, p5.js के अनुभवी रखरखावकर्ता हों, या कहीं बीच में हों, यह गाइड जानकारी के साथ-साथ उन सुझावों और ट्रिक्स को शामिल करता है जो आपको p5.js में प्रभावी योगदान देने में मदद करेगा। यहां लिखा गया अधिकांश दिशानिर्देश हैं, अगर कुछ और नहीं बताया गया है, तो इसका अर्थ है कि आप यहां दिखाए गए अभ्यासों को अपने काम के लिए अनुकूल बना सकते हैं।

## विषय सूची

- [Issues](steward_guidelines.md#issues)
  - [Bug report](steward_guidelines.md#bug-report)
  - [Feature request](steward_guidelines.md#feature-request)
  - [Feature enhancement](steward_guidelines.md#feature-enhancement)
  - [Discussion](steward_guidelines.md#discussion)
- [Pull Requests](steward_guidelines.md#pull-requests)
  - [Simple fix](steward_guidelines.md#simple-fix)
  - [Bug fix](steward_guidelines.md#bug-fix)
  - [New feature/feature enhancement](steward_guidelines.md#new-feature-feature-enhancement)
  - [Dependabot](steward_guidelines.md#dependabot)
- [Build Process](steward_guidelines.md#build-process)
  - [Main build task](steward_guidelines.md#main-build-task)
  - [Miscellaneous tasks](steward_guidelines.md#miscellaneous-tasks)
- [Release Process](steward_guidelines.md#release-process)
- [Tips & Tricks](steward_guidelines.md#tips--tricks)
  - [Reply templates](steward_guidelines.md#reply-templates)
  - [GitHub CLI](steward_guidelines.md#github-cli)
  - [Managing notifications](steward_guidelines.md#managing-notifications)

---

## समस्याएँ

हम अधिकांश स्रोत कोड योगदानों को एक समस्या के साथ शुरू करने की प्रोत्साहना करते हैं, और इस तरह, समस्याओं में अधिकांश चर्चाएँ होंगी। समस्या को समीक्षा करने के लिए लेने के चरण वास्तव में यह निर्भर करेगा कि यह कैसी समस्या है। रेपो विभिन्न प्रकार की समस्याओं को बेहतर ढंग से व्यवस्थित करने और समस्या लेखकों को अपनी समस्याओं के बारे में सभी प्रासंगिक जानकारी प्रदान करने के लिए [गिटहब समस्या टेम्पलेट](https://github.com/processing/p5.js/blob/main/.github/ISSUE_TEMPLATE) का उपयोग करता है। समस्या की समीक्षा की पहली कदम अक्सर भरे गए टेम्पलेट को देखना होगा और यह तय करना होगा कि क्या आपको अतिरिक्त जानकारी की आवश्यकता है (जैसे कि कुछ क्षेत्र भरे नहीं गए हों या गलत टेम्पलेट का प्रयोग किया गया हो)।

### बग रिपोर्ट

Bबग रिपोर्ट समस्याओं को "बग मिला" (Found a bug) समस्या टेम्पलेट का प्रयोग करना चाहिए। बग रिपोर्ट को समाधान करने के लिए निम्नलिखित कार्यक्रम सामान्य होता है:

1. बग को अनुकृत करें
   - टेम्पलेट का उद्देश्य एक समीक्षक को समस्या को श्रद्धापूर्वक प्रयास करने के लिए पर्याप्त जानकारी प्रदान करना है।
   - यदि रिपोर्ट की गई समस्या प्राथमिकता सूची में नहीं है (p5.js, p5.js-वेबसाइट, या अन्यत्र):
     - यदि आपके पास इसका उपयोगकर्ता है, तो बग रिपोर्ट को संबंधित रेपो में स्थानांतरित करें।
     - अन्यथा, एक टिप्पणी छोड़ें जिसमें बग रिपोर्ट को कहां फाइल किया जाना चाहिए (सीधा लिंक सहित) और समस्या को बंद करें।
   - बग रिपोर्ट का समीक्षा करने का पहला कदम यह है कि क्या एक बग प्रतिरूपण के लिए पर्याप्त जानकारी प्रदान की गई है, और यदि हां, तो समान रूप से बग को जैसा वर्णित किया गया है उसी रूप में प्रतिरूपित करने का प्रयास करें।
2. अगर बग प्रतिरूपित किया जा सकता है:
   - किसी विशेष बग को सही करने का सबसे अच्छा तरीका निर्धारित करने के लिए कुछ चर्चा की जा सकती है। कभी-कभी, यह सीधा हो सकता है; कभी-कभी, यह कठिन हो सकता है। कृपया इस निर्णय को एक मामला-दर-मामला आधार पर लेते समय [p5.js' डिज़ाइन सिद्धांतों](design_principles.md) का उल्लेख करें।
   - यदि समस्या लेखक ने समस्या में इस संकेत किया है कि वे एक सुधार योगदान देने के लिए तत्पर हैं:
     - कॉमेंट छोड़कर समस्या को सुधारने के लिए समस्या लेखक को स्वीकृत करें और उन्हें समस्या के लिए असाइन करें। "असाइनी" के बगल में "टोलिया" का उपयोग करें।
   - यदि समस्या लेखक कोई सुधार नहीं करना चाहते हैं:
     - बग प्रतिरूपित होने का स्वीकृति छोड़ें।
     - खुद को सुधारने का प्रयास करें या बग को ठीक करने की आवश्यकता होने पर मदद की जरूरत के लिए `मदद चाहिए (help wanted)` लेबल जोड़ें।
3. यदि बग प्रतिरूपित नहीं हो सकता है:
   - अतिरिक्त जानकारी के लिए पूछें यदि पहले से ही टेम्पलेट में नहीं शामिल किया गया है (p5.js संस्करण, ब्राउज़र संस्करण, ओएस संस्करण आदि)।
   - यदि आपका परीक्षण पर्याप्त नहीं है जो समस्या में रिपोर्ट किया गया है (उदाहरण के लिए, एक अलग ब्राउज़र या ओएस):
     - एक टिप्पणी छोड़ें कि आप अपने विशिष्ट पर्यावरण में प्रतिरूपित नहीं कर सकते हैं।
     - बग को प्रतिरूपित करने के लिए `मदद चाहिए (help wanted)` लेबल जोड़ें और समस्या को जिन निर्दिष्ट सेटअप के साथ प्रतिरूपित किया गया है, उनसे बग को प्रतिरूपित करने के लिए कहें।
   - कभी-कभी, बग केवल वेब संपादक का उपयोग करते समय ही होते हैं और स्थानीय टेस्ट करते समय नहीं। इस मामले में, समस्या को [वेब संपादक रेपो](https://github.com/processing/p5.js-web-editor) की ओर पुनर्निर्देशित किया जाना चाहिए।
   - यदि प्रतिरूपण बाद में संभव है, तो कदम 2 पर वापस जाएं।
4. यदि बग उपयोगकर्ता द्वारा प्रदान किए गए कोड से आता है और p5.js' व्यवहार नहीं:
   - यह निर्धारित करें कि क्या p5.js' दस्तावेज़ीकरण, कोड कार्यान्वयन, या मित्रसंपर्क त्रुटि प्रणाली को सुधारा जा सकता है ताकि वही गलती फिर से न हो।
   - कृपया आगे किसी भी परिवर्तन के लिए [मंच](https://discourse.processing.org/) या [डिस्कॉर्ड](https://discord.com/invite/SHQ8dH25r9) पर और अधिक प्रश्न अद्यतन करें और यदि p5.js में कोई अधिक परिवर्तन नहीं करना है, तो समस्या को बंद करें।

### सुविधा अनुरोध

सुविधा अनुरोध समस्याएँ "नई सुविधा अनुरोध" समस्या टेम्पलेट का उपयोग करना चाहिए। सुविधा अनुरोध को सम्बोधित करने के लिए निम्नलिखित वर्कफ़्लो सामान्य है:

1. p5.js की पहुंच बढ़ाने के रूप में, सुविधा अनुरोध को यह साबित करना होगा कि यह प्रोजेक्ट कैसे p5.js के इतिहास में तब भी समुदायों के लिए पहुंच को बढ़ाता है जब वे इस क्षेत्र में नाज़िम किए गए हैं। अधिक विवरण [यहां](access.md) उपलब्ध हैं।
   - यदि कोई सुविधा अनुरोध "पहुंच बढ़ाने" क्षेत्र को पर्याप्त रूप से भरा नहीं है, तो आप समस्या लेखक से सुविधा कैसे पहुंच बढ़ाती है, इसके बारे में पूछ सकते हैं।
   - सुविधा का पहुंच का बयान किसी अलग समुदाय सदस्य, समस्या समीक्षकों सहित, द्वारा प्रदान किया जा सकता है।
2. नई सुविधा अनुरोध को निम्नलिखित मानकों के आधार पर समाविष्टि के लिए मूल्यांकन किया जा सकता है।
   - क्या सुविधा परियोजना के धारा और [डिज़ाइन सिद्धांतों](design_principles.md) में फिट है?
     - उदाहरण के लिए, एक नई आकृति जोड़ने का अनुरोध किया जा सकता है, लेकिन ब्राउज़र-आधारित आईओटी प्रोटोकॉल को ग्रहण करने का अनुरोध असंगत होगा।
     - सम्पूर्ण रूप से, p5.js का धारा संक्षिप्त होना चाहिए ताकि अनियमित उपयोग की सुविधाओं से बचा जा सके।
     - यदि कोई सुविधा p5.js के धारा में फिट नहीं होती है, तो सुझाव दें कि समस्या लेखक सुविधा को एक ऐड-ऑन पुस्तकालय के रूप में अमल करें।
     - यदि स्पष्ट नहीं है कि यह फिट है या नहीं, तो एक प्रमाण-प्रतिसाद के रूप में एक ऐड-ऑन पुस्तकालय बनाने का सुझाव देना एक अच्छा विचार हो सकता है। यह प्रयोक्ताओं को सुविधा का उपयोग करने का एक तरीका देता है, इसका उपयोग और महत्ता का एक अधिक स्पष्ट उदाहरण प्रदान करता है, और पूरी तरह से एक स्थायी समाधान की तरह पूरा नहीं होना चाहिए। यह परियोजना की मूल धारा में बाद में शामिल किया जा सकता है।
   - Is the feature likely to cause a breaking change?
     - Will it conflict with existing p5.js functions and variables?
     - Will it conflict with typical sketches already written for p5.js?
     - निम्नलिखित सुविधाएं जो संघर्ष पैदा कर सकती हैं जैसा कि उपरोक्त किए गए वे ब्रेकिंग बदलाव के रूप में गिना जाता है। [प्रमुख संस्करण रिलीज](https://docs.npmjs.com/about-semantic-versioning) के बिना, हमें p5.js में ब्रेकिंग बदलाव नहीं करने चाहिए।
   - क्या प्रस्तावित नई सुविधा को पहले से p5.js में मौजूद सुविधाओं का उपयोग करके, एक्सिस्टिंग साधारित जावास्क्रिप्ट कोड या मौजूदा सरल उपयोगिता वाली पुस्तकालयों का उपयोग करके प्राप्त किया जा सकता है?
     - For example, instead of providing a p5.js function to join an array of strings such as `join(["Hello", "world!"])`, the native JavaScript `["Hello", "world!"].join()` should be preferred instead.
3. यदि पहुँच आवश्यकता और अन्य विचारों को पूरा किया गया है, तो नई सुविधा अनुरोध को प्रारंभ किया जाना चाहिए जब तक कि कार्य पीआर की ओर न हो। नई सुविधाओं के पीआर की समीक्षा प्रक्रिया नीचे विवरणित है।

### सुविधा विस्तार

सुविधा विस्तार समस्याओं का उपयोग करना चाहिए "मौजूदा सुविधा विस्तार" समस्या टेम्प्लेट का। प्रक्रिया नई सुविधा अनुरोधों के साथ बहुत समान है। नई सुविधा अनुरोध और सुविधा विस्तार के बीच का अंतर कभी-कभी कम हो सकता है। सुविधा विस्तार मुख्य रूप से p5.js के मौजूदा कार्यों के साथ संबंधित होता है जबकि नई सुविधा अनुरोध पूरी तरह से नए कार्यों को जोड़ने का अनुरोध कर सकता है।

1. नई सुविधा अनुरोधों की तरह, सुविधा विस्तार को केवल उन्हें स्वीकार किया जाना चाहिए अगर वे p5.js के पहुँच को बढ़ाते हैं। कृपया [ऊपर दिए गए खंड](./steward_guidelines.md/#सुविधा-अनुरोध) का बिंदु 1 देखें।
2. सुविधा विस्तारों के समावेश की मान्यता देने की मानदंड नए सुविधा अनुरोधों के लिए तुलनात्मक होती हैं, लेकिन भिन्नता तब की जाती है जब संभावित ब्रेकिंग बदलावों पर विशेष ध्यान दिया जाता है।

- मौजूदा कार्यों को संशोधित करते समय, सभी पिछले मान्य और दस्तावेजित कार्य साकार तरीके से बर्ताव करने चाहिए।

3. सुविधा विस्तारों को कम से कम एक स्टीवर्ड या मेंटेनर द्वारा मंजूर किया जान| चाहिए जब काम की ओर प्रीआर किया जाना चाहिए। सुविधा विस्तार के लिए पीआर समीक्षा प्रक्रिया नीचे विवरणित है।

### चर्चा

इस प्रकार की समस्या के पास एक न्यूनतम टेम्प्लेट ("चर्चा" (discussion)) होता है और इसका उपयोग विषय के चारों ओर संवाद जमा करने के लिए किया जाना चाहिए, जो बाद में किसी विशेष मुद्दे में एकत्रित किया जाता है, जैसे कि एक सुविधा अनुरोध। इन प्रकार की चर्चा समस्याओं को समाप्त होने पर बंद किया जा सकता है और परिणामी अधिक विशिष्ट समस्याएं बना दी गई हैं:

- If an issue is opened as a discussion but should be, for example, a bug report, the correct label should be applied and the "discussion" label removed. Additional info about the bug should also be requested from the author if not already included.
- If an issue is opened as a discussion but isn't relevant to source code contribution or otherwise relevant to the GitHub repositories/contribution process/contribution community, they should be redirected to the forum or Discord and the issue closed.
- यदि लागू हो, तो चर्चा इस्स्यूज के लिए अतिरिक्त लेबल जोड़े जा सकते हैं ताकि एक नजर में यह देखा जा सके कि यह किस प्रकार की चर्चा है।

---

## पुल रिक्वेस्ट

प्राय: p5.js रिपॉजिट्रीज में कोड योगदानों का अधिकांश पुल रिक्वेस्ट के माध्यम से होता है। स्टीवर्ड और मेंटेनर्स रिपॉजिट्रीज के पुश एक्सेस रख सकते हैं लेकिन जब भी कोड योगदान किया जाता है, तो वे पुल रिक्वेस्ट की समीक्षा करने को प्रोत्साहित किया जाता है। यहां पीआर की समीक्षा के चरण दिए गए हैं:

- पुल रिक्वेस्ट टेम्पलेट [यहाँ मिलेगा](https://github.com/processing/p5.js/blob/main/.github/PULL_REQUEST_TEMPLATE.md)|
- लगभग सभी पुल रिक्वेस्ट के साथ संबंधित इस्स्यूज खोले और पहले चर्चा की जानी चाहिए, अर्थात पुश संबंधित इस्स्यूज के पहले पीआर की समीक्षा किया जाना चाहिए किसी भी स्टीवर्ड या मेंटेनर द्वारा। [issue workflow](steward_guidelines.md#issues) must have been followed first
  - The only instances where this does not apply are very minor typo fixes, which do not require an open issue and can be merged by anyone with merge access to the repo, even if they are not stewards of a particular area.
  - While this exception exists, we will apply it in practice only while contributors are still encouraged to open new issues first. In other words, if in doubt about whether this exception applies, just open an issue anyway.
- If a pull request does not fully solve the referenced issue, you can edit the original post and change "Resolves #OOOO" to "Addresses #OOOO" so that it does not automatically close the original issue when the PR is merged.

### सरल सुधार

Simple fixes, such as a small typo fix, can be merged directly by anyone with merge access.  Check on the PR "Files Changed" tab to ensure  that the automated CI test passes.

![The "files changed" tab when viewing a pull request on GitHub](images/files-changed.png)

![The "All checks have passed" indicator on a GitHub pull request, highlighted above the merge button](images/all-checks-passed.png)

### बग फ़िक्स

1. बग फ़िक्स का समीक्षा उस संबंधित क्षेत्र के स्टीवर्ड द्वारा किया जाना चाहिए, आदर्शतः उसी जिसने संदर्भित मुद्दे को फ़िक्स के लिए स्वीकृति दी थी।
2. पीआर "फ़ाइल बदले" टैब का उपयोग प्रारंभिक रूप से इसकी समीक्षा करने के लिए किया जा सकता है कि क्या फ़िक्स मुद्दे के चर्चा में वर्णित रूप में लागू किया गया है।
3. पीआर को संभावनापूर्वक और संबंधित होने पर स्थानीय रूप से परीक्षण किया जाना चाहिए। यदि संभव हो, तो गिटहब CLI प्रक्रिया के कुछ हिस्सों को समीक्षा करने में मदद कर सकता है। (यहाँ और [टिप्स और ट्रिक्स](Add link to tips and trick) में अधिक देखें).
   - [ ] फ़िक्स को मूल मुद्दे को पर्याप्त रूप से संबोधित करना चाहिए।
   - [ ] फ़िक्स को किसी भी मौजूदा व्यवहार में परिवर्तन नहीं करना चाहिए जब तक मूल मुद्दे में सहमति न हो।
   - [ ] फ़िक्स पर p5.js पर कोई महत्वपूर्ण प्रभाव नहीं होना चाहिए।
   - [ ] फ़िक्स पर p5.js की पहुँच कोई प्रभाव नहीं होना चाहिए।
   - [ ] फ़िक्स को जावास्क्रिप्ट कोडिंग के आधुनिक मानक का उपयोग करना चाहिए।
   - [ ] फ़िक्स को सभी स्वचालित परीक्षणों को पार करना चाहिए और यदि योग्य हो, तो नए परीक्षण शामिल करना चाहिए।
4. यदि कोई अतिरिक्त परिवर्तन आवश्यक हो, तो पंक्ति टिप्पणियाँ यहाँ जोड़ी [जानी चाहिए](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request#adding-line-comments-to-a-pull-request)।
   - एक सुझाव ब्लॉक का उपयोग किया जा सकता है विशिष्ट परिवर्तनों का सुझाव देने के लिए:
     ![The Suggest Change button while writing a comment on code in a GitHub pull request](images/suggest-change.png)\
     ![A suggested change appearing within code fences with the "suggestion" tag](images/suggested-value-change.png)\
     ![A suggested change previewed as a diff](images/suggestion-preview.png)
   - यदि कई परिवर्तन की आवश्यकता है, तो एकाधिक बार एकल-लाइन टिप्पणियाँ न जोड़ें। बजाय इसके, कई-लाइन टिप्पणियाँ और एक ही परिवर्तन के लिए एक मांग करने के लिए यहाँ दस्तावेज़ की प्रक्रिया का [पालन करें](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/reviewing-proposed-changes-in-a-pull-request)।
   - यदि लाइन टिप्पणियाँ स्पष्टीकरण या चर्चा के लिए हैं, तो "अनुरोध परिवर्तन" की बजाय "टिप्पणी" का चयन करें:\
     ![The "comment" option circled within the GitHub Finish Review menu](images/comment-review.png)
5. एक बार पीआर की समीक्षा की गई है और कोई अतिरिक्त परिवर्तन आवश्यक नहीं है, तो एक स्टीवर्ड पिछले चरण में "मंजूर" चयन करके पीआर को "मंजूर" चिह्नित कर सकता है, जिसमें अतिरिक्त टिप्पणियों के साथ या बिना चयन किया जा सकता है। स्टीवर्ड फिर अगर चाहें तो एक अन्य स्टीवर्ड या रक्षक से अतिरिक्त समीक्षा का अनुरोध कर सकता है, यदि उनके पास मर्ज पहुंच है, तो पीआर को मर्ज कर सकता है, या रक्षक से मर्ज का अनुरोध कर सकता है।

6. @[all-contributors](https://allcontributors.org/docs/en/emoji-key) बॉट को बुलाया जाना चाहिए ताकि `README.md` फ़ाइल में नए योगदानकर्ताओं को योगदानकर्ताओं की सूची में जोड़ा जा सके। `[योगदान के प्रकार]` के स्थान पर हर प्रकार का योगदान निर्दिष्ट किया जा सकता है, योगदान के उपलब्ध प्रकार की पूरी सूची ऊपर दी गई लिंक में मिलेगी।

`@all-contributors` `please` `add` `@[गिटहब हैंडल]` `for` `[योगदान के प्रकार]`

### नई सुविधा/सुविधा वृद्धि

नई सुविधा या सुविधा वृद्धि पीआर के लिए परिक्रिया बग निवारण के साथ मिलती जुलती है, केवल एक विशेष अंतर है:

- एक नई सुविधा/सुविधा वृद्धि पीआर को मर्ज करने से पहले कम से कम दो स्टीवर्ड या रक्षक द्वारा समीक्षित और मंजूर किया जाना चाहिए।

### डिपेंडेबॉट

डिपेंडेबॉट पीआर आमतौर पर केवल रिपो व्यवस्थापकों को ही दिखाई जाती हैं, इसलिए यदि यह आपके लिए लागू नहीं होता है, तो कृपया इस खंड को छोड़ें।

- डिपेंडेबॉट पीआर [सीमवर पैच](https://semver.org/) संस्करण है और स्वचालित सीआई परीक्षण पास हो जाता है तो सीधे मर्ज किए जा सकते हैं।
- सेमवर माइनर संस्करण परिवर्तन के साथ डिपेंडेबॉट पीआर आमतौर पर स्वचालित सीआई परीक्षण पास होने के तुरंत बाद सीधे मर्ज किए जा सकते हैं। अपडेट की गई आवश्यकता के चेकलिस्ट पर एक त्वरित जांच की जाती है।
- Dependabot PRs with semver major version changes may likely affect either the build process or p5.js functionalities. The reviewer, in this case, is encouraged to review the changelog from the current version to the target version if possible and test the PR locally to ensure all processes are functioning and make any required changes due to potential breaking changes in the dependencies.
  - कई निर्भरताओं ने मुख्य संस्करण संख्याओं को केवल इसलिए बढ़ाया है क्योंकि वे बहुत पुराने संस्करणों के लिए आधिकारिक समर्थन को हटा देते हैं। बहुत से मामलों में, मुख्य संस्करण परिवर्तन निर्भरता एपीआई परिवर्तन से होने वाले तोड़फोड़ को नहीं अवश्य मतलब है।

---

## निर्माण प्रक्रिया

यह खंड सामान्य निर्माण सेटअप या आदेश का विवरण नहीं करेगा, बल्कि विवरणों के पीछे क्या हो रहा है उसके बारे में जानकारी देगा। कृपया अधिक विस्तृत निर्माण जानकारी के लिए [योगदानकर्ता दिशानिर्देश](Add link to contributor guidlines) देखें।

`Gruntfile.js` फ़ाइल p5.js के मुख्य निर्माण परिभाषणों को संबोधित करती है। पुस्तकालय और दस्तावेज़ीकरण निर्माण के लिए उपयोग किए जाने वाले विभिन्न उपकरणों में `Grunt`, `Browserify`, `YUIDoc`, `ESLint`, `Babel`, `Uglify`, और `Mocha` शामिल हैं। यह हमारे लिए `डिफ़ॉल्ट` टास्क के साथ शुरू करने और वहां से पिछले काम करने में मददगार हो सकता है। इस विवरण के दौरान `Gruntfile.js` दस्तावेज़ को खोलना भी उपयोगी हो सकता है।

### मुख्य निर्माण कार्य

```
grunt.registerTask('default', ['lint', 'test']);
```

जब हम `grunt` या `npm` स्क्रिप्ट npm `test` चलाते हैं, तो हम लिंट फिर परीक्षण के रूप में लिंट का डिफ़ॉल्ट टास्क चलाते हैं।

#### `lint` कार्य

```
grunt.registerTask('lint', ['lint:source', 'lint:samples']);
```

लिंट कार्य में दो उप-कार्य होते हैं: `lint:source` और `lint:samples`। `lint:source` को तीन और उप-कार्यों में विभाजित किया गया है `eslint:build`, `eslint:source`, और `eslint:test`, जो ESLint का उपयोग निर्माण स्क्रिप्ट, सोर्स कोड, और परीक्षण स्क्रिप्ट की जाँच करने के लिए करता है।

The `lint:samples` task will first run the `yui` task which itself consists of `yuidoc:prod`, `clean:reference`, and `minjson`, which extract the documentation from the source code into a JSON document, remove unused files from the previous step, and minify the generated JSON file into `data.min.json` respectively.

Next in `lint:samples` is `eslint-samples:source`, which is a custom written task whose definition is in [./tasks/build/eslint-samples.js](tasks/build/eslint-samples.js); it will run ESLint to check the documentation example code to make sure they follow the same coding convention as the rest of p5.js (`yui` is run first here because we need the JSON file to be built first before we can lint the examples).

#### `test` कार्य

```js
grunt.registerTask("test", ["build", "connect:server", "mochaChrome", "mochaTest", "nyc:report"]);
```

सबसे पहले अपने तहत `test` के नीचे `build` कार्य को देखते हैं।

```js
grunt.registerTask("build", ["browserify", "browserify:min", "uglify", "browserify:test"]);
```

`browserify` से शुरू होने वाले कार्य [./tasks/build/browserify.js](tasks/build/browserify.js) में परिभाषित होते हैं। इनमें सभी मुख्य कदम होते हैं जो बहुत से उपयोगकर्ता कोड फ़ाइलों को संग्रहीत और एक में बनाने के लिए हैं:

- `browserify` p5.js बनाता है जबकि `browserify:min` अगले कदम में संक्षिप्त किए जाने वाले एक बीच की फ़ाइल को बनाता है। `browserify` और `browserify:min` के बीच अंतर यह है कि `browserify:min` FES के लिए कार्यात्मक नहीं होने वाले डेटा को नहीं समाहित करता।
- `uglify` `browserify:min` की उत्पादित फ़ाइल को छोटा करता है और अंतिम `p5.min.js` में इसे छोटा करता है (इस कदम की विन्यासिकता मुख्य `Gruntfile.js` में है)।
- `browserify:test` एक पूरे p5.js के संग्रह को बनाता है, लेकिन परीक्षण कोड कवरेज रिपोर्टिंग के लिए जोड़ा गया कोड जोड़ता है ([Istanbul](https://istanbul.js.org/) का उपयोग करके)।

पहले, नोड.जेएस के `fs.readFileSync()` का उपयोग फाइल की वास्तविक सामग्री के साथ प्रतिस्थापित किया जाता है जिसे `brfs-babel` का उपयोग किया जाता है। यह मुख्य रूप से वेबजीएल कोड के लिए उपयोग किया जाता है जो अलग फ़ाइलों के रूप में लिखा गया है।

Next, the source code, including all dependencies from node_modules, is transpiled using Babel to match the [Browserslist](https://browsersl.ist/) requirement defined in package.json as well as to make the ES6 import statements into CommonJS `require()` that browserify understands. This also enables us to use newer syntax available in ES6 and beyond without worrying about browser compatibility.

बंडलिंग के बाद, लेकिन फ़ाइल में लिखा जाने से पहले, कोड को `pretty-fast` के माध्यम से पार किया जाता है, यदि यह न्यूनतम नहीं है, तो इसे साफ कर दिया जाता है ताकि अंतिम स्वरूपण कुछ संरचनात्मक रूप से अधिक संबंधित हो (हम उम्मीद करते हैं कि p5.js स्रोत कोड पढ़ा और जांचा जा सकता है यदि इच्छित है)।

यहां कुछ छोटे विस्तृत कदम छोड़े गए हैं; आप नीचे दिए गए ब्राउज़रीफ़ाई निर्माण परिभाषण फ़ाइल की जांच करने के लिए सब कुछ को और करीब से देख सकते हैं।

```
connect:server
```

यह कदम स्थानीय सर्वर को स्पिन करता है जो परीक्षण फ़ाइलों और निर्मित स्रोत कोड फ़ाइलों को होस्ट करता है ताकि क्रोम में स्वचालित परीक्षण चलाया जा सके।

```
mochaChrome
```

यह कदम [./tasks/test/mocha-chrome.js](tasks/test/mocha-chrome.js) में परिभाषित है। यह प्यूपिटीयर का उपयोग करता है जो क्रोम का एक हेडलेस संस्करण स्पिन करता है जिसे रिमोट नियंत्रित किया जा सकता है और `./test` फ़ोल्डर में `HTML` फ़ाइलों के साथ जुड़े परीक्षणों को चलाता है, जिसमें लाइब्रेरी के अनमिनिफ़ाइड और मिनिफ़ाइड संस्करणों को यूनिट परीक्षण सुइटों के साथ परीक्षण किया जाता है साथ ही सभी संदर्भ उदाहरणों का परीक्षण किया जाता है।

```
mochaTest
```

This step differs from `mochaChrome` in that it is run in node.js instead of in Chrome and only tests a small subset of features in the library. Most features in p5.js will require a browser environment, so this set of tests should only be expanded if the new tests really don't need a browser environment.

```
nyc:report
```

आखिरकार, सभी निर्माण और परीक्षण पूर्ण होने के बाद, यह कदम परीक्षण कवरेज रिपोर्ट इकट्ठा करेगा जबकि `mochaChrome` ने पुस्तकालय का पूर्ण संस्करण परीक्षण किया था और परीक्षण कवरेज डेटा को कंसोल में प्रिंट करेगा। p5.js के परीक्षण कवरेज को मुख्यतः मॉनिटरिंग और कुछ अतिरिक्त डेटा बिंदुओं के लिए है; 100% परीक्षण कवरेज का उद्देश्य नहीं है।

और यही `Gruntfile.js` कॉन्फ़िगरेशन में डिफ़ॉल्ट कार्य को कवर करता है!

### विविध कार्य

सभी कदमों को `npx grunt [कदम]` के साथ सीधे चलाया जा सकता है। ऊपर नहीं चित्रित कुछ कार्य हैं जो ऊपर नहीं शामिल हैं लेकिन कुछ विशेष प्रकार के मामलों में उपयोगी हो सकते हैं।

```
grunt yui:dev
```

यह कार्य ऊपर विवरणित दस्तावेज़ और पुस्तकालय निर्माण को चलाएगा, उसके बाद उसी कोड के स्रोत में चिलम करने के लिए एक वेब सर्वर को स्पिन करेगा जिसका आप वेबसाइट पर [http://localhost:9001/docs/reference/](http://localhost:9001/docs/reference/) पर संदर्भ पृष्ठ के संविदानी संस्करण के रूप में प्राप्त कर सकते हैं। फिर, यह स्रोत कोड के लिए बदलावों का मॉनिटर करेगा और संदर्भ और पुस्तकालय को फिर से निर्माण करेगा।

`grunt` `yui:dev` उस समय उपयोगी है जब आप इनलाइन दस्तावेज़ में संदर्भ पर काम कर रहे हों क्योंकि आपको प्रति बार जब आप एक परिवर्तन करते हैं, तो आपको पिछले p5.js रिपॉजिटरी से निर्मित फ़ाइलों को स्थानीय p5.js-वेबसाइट रिपॉजिटरी में ले जाने और वेबसाइट को पुनः निर्मित करने की आवश्यकता नहीं होती है, और आप बस अपने परिवर्तनों को अपने ब्राउज़र में संदर्भ के इस संविदानी संस्करण की एकदम साधारित रूप में पूर्वावलोकन कर सकते हैं। इस तरह, आपको यह भी अधिक विश्वसनीय हो सकता है कि आपके द्वारा किए गए परिवर्तनों का सही रूप से वेबसाइट पर प्रकट होने की संभावना है। ध्यान दें कि यह केवल इनलाइन दस्तावेज़ के संशोधनों के लिए है; संदर्भ पृष्ठ इसका हिस्सा, संशोधन और लेआउट सहित, वेबसाइट रिपॉजिटरी पर बनाए और परीक्षण किए जाने चाहिए।

```
grunt watch
grunt watch:main
grunt watch:quick
```

वॉच कार्य विभिन्न फ़ाइलों के लिए बदलावों की निगरानी करेंगे और कौन से फ़ाइलों में क्या परिवर्तन हुआ है, उस अनुसार संबंधित कार्यों को चलाएगे। ये सभी कार्य एक ही चीज़ करते हैं, जिसका केवल विस्तार है।

The `watch` task will run all builds and tests similar to running the full default task on detecting changes in the source code.

The `watch:main` task will run the library build and tests but not rebuild the reference on detecting changes in the source code.

The `watch:quick` task will run the library build only on detecting changes in the source code.

Depending on what you are working on, choosing the most minimal watch task here can save you from having to manually run a rebuild whenever you want to make some changes.

---

## Release process

कृपया रिलीज [`release_process.md`](release_process.md) देखें।

---

## युक्तियाँ और ट्रिक्स

कभी-कभी, समीक्षा के लिए जितने भी जटिल पीआर हैं, उन्हें स्थानीय रूप से परीक्षण करने के लिए गिट के जटिल कमांड की आवश्यकता हो सकती है। भाग्य से, गिटहब सीएलआई टूल इस प्रक्रिया और अधिक के साथ बहुत मदद कर सकता है।

### Reply templates

A handy GitHub feature that you can use is the [Saved Replies](https://docs.github.com/en/get-started/writing-on-github/working-with-saved-replies/about-saved-replies) feature, which is available to use when authoring a reply to issues or pull requests. Some of the workflow described above may require responding to issues or PRs with identical or very similar replies (redirecting questions to the forum, accepting an issue for fixing, etc.), and using Saved Replies can just ever so slightly make this more efficient.

Below are some of the Saved Replies that are being used by p5.js maintainers. You can use them yourself or create your own!

##### Closing: Can’t Reproduce

> We're not able to reproduce this, but please feel free to reopen if you can provide a code sample that demonstrates the issue. Thanks!

##### Closing: Need Snippet

> I'm closing this for organizational purposes. Please reopen if you can provide a code snippet that illustrates the issue. Thanks!

##### Closing: Use the Forum

> The GitHub issues here are a good place for bugs and issues with the p5.js library itself. For questions about writing your own code, tests, or following tutorials, the [forum](https://discourse.processing.org/) is the best place to post. Thanks!

##### Closing: GSOC

> Thanks! The best place to discuss GSOC proposals is on our [forum](https://discourse.processing.org/c/summer-of-code).

##### Closing: Access

> I'm not seeing a lot of interest in this feature, and we don't have a clear explanation of how it [expands access](access.md), so I will close this for now. If an access statement can be added to the issue request, please feel welcome to reopen.

> We do not see a further explanation of how this issue [expands access](access.md), so I will close this issue for now. If a more detailed access statement can be added to the feature request, please feel welcome to reopen it. Thank you!

##### Closing: Addon

> I think this function is beyond the scope of the p5.js API (we try to keep it as minimal as possible), but it could be a great starting point for an addon library. See the docs here for how to create an addon: [https://github.com/processing/p5.js/blob/main/contributor_docs/creating_libraries.md](creating_libraries.md)

##### Closing PR: Need Issue First

> Thank you. As a reminder, issues need to be opened before pull requests are opened and tagged with the issue. This is necessary for tracking development and keeping discussion clear. Thanks!

##### Approve issue for fixing

> You can go ahead with a fix. Thanks.

##### Merged PR

> Looks good. Thanks!

### GitHub CLI

Reviewing a complex PR can be difficult with complex git commands required to get the PR's version of code locally for you to test. Fortunately, the [GitHub CLI](https://cli.github.com/) tool can help greatly with this process and more.

क्लाइंट को स्थानीय रूप से लिंक करने के लिए इस आईडी का कमांड `gh pr checkout [पुल रिक्वेस्ट आईडी]` चलाने से पीआर की संस्करण कोड को आपके लिए स्थानीय रूप से प्राप्त करना संभव है, और रिमोट फोर्क को प्राप्त करने, एक ब्रांच बनाने और ब्रांच को चेकआउट करने की प्रक्रिया सभी आपके लिए स्वचालित रूप से की जाती है। मुख्य शाखा पर वापस जाना एक ब्रांच को स्विच करने के लिए उसी तरह होगा जैसे `git checkout` मेन। आप एक टिप्पणी भी छोड़ सकते हैं बिना वेबपेज पर जाने की आवश्यकता के साथ पीआर में से!

गिटहब एसईएलआई में बहुत सारे अन्य कमांड भी उपलब्ध हैं जो आपको उपयोगी हो सकते हैं या नहीं मिल सकते हैं, लेकिन यह एक अच्छा उपकरण है जिसका आपके आसपास होना है किसी भी मामले में।

### सूचनाओं का प्रबंधन

नए मुद्दों या पीआर के लिए "मुद्दे" या "पुल रिक्वेस्ट" टैबों का मैन्युअल निगरानी करने की बजाय, आप रिपो को देखकर "नजर रखना (watch)" कर सकते हैं जिसमें रेपो के नाम के साथ एक आई आइकन है जो रेपो के नाम के विपरीत है।

![Cropped screenshot of the top right corner of a GitHub repository page showing a series of buttons in the center from left to right: Sponsor, Watch, Fork, Starred.](images/github-repo-metrics.png)

रेपो को देखकर, नई समस्याएं, नई पुल रिक्वेस्ट्स, आपके उपयोगकर्ता हैंडल का उल्लेख, और अन्य गतिविधियां, जिनकी आपने रेपो में सब्सक्राइब की हैं, इन घटनाओं को आपके [सूचना पृष्ठ](https://github.com/notifications) पर सूचनाएं के रूप में भेजी जाती हैं, जिन्हें आप स्वीकार कर सकते हैं या उन्हें ईमेल इनबॉक्स की तरह पढ़कर या खारिज कर सकते हैं।

कई मामलों में, आपको GitHub से रेपो में हो रही घटनाओं के बारे में ईमेल भी मिल सकते हैं, और आप इन्हें अपनी [सूचना सेटिंग्स पेज](https://github.com/settings/notifications) से कस्टमाइज़ कर सकते हैं (पूरी तरह से उनका अनसब्सक्राइब करके समेत)।

आपके काम करने के तरीके को ध्यान में रखते हुए इन्हें सेट करना, समस्याओं/पीआर समीक्षा को मैन्युअली से खोजने की आवश्यकता न हो और GitHub से अंतहीन सूचनाओं से अधिक भरी होने से बचाने में अंतर हो सकता है। यहां एक अच्छा संतुलन आवश्यक है। एक शुरुआती सुझाव के रूप में, स्टीवर्ड्स को इस रेपो के लिए "समस्याएँ" और "पुल रिक्वेस्ट्स" के लिए देखना चाहिए और इसे "भाग लेना, @मेंशन्स और कस्टम (Participating, @mentions and custom)" पर सेट करना चाहिए।
