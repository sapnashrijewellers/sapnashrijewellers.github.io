import React from "react";
export default function HUIDInfo() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm max-w-2xl mx-auto mt-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-yellow-600 text-2xl">ℹ️</span>
        <h2 className="text-xl font-semibold text-yellow-800">
          HUID हॉलमार्किंग क्यों ज़रूरी है?
        </h2>
      </div>

      <p className="text-gray-800 leading-relaxed mb-3">
        HUID (Hallmark Unique Identification) एक <strong>विशेष 6-अंकों का कोड</strong> होता है,
        जो हर सोने या चांदी के आभूषण पर अंकित किया जाता है। यह कोड यह सुनिश्चित करता है कि
        आपका आभूषण <strong>BIS (भारतीय मानक ब्यूरो)</strong> द्वारा प्रमाणित और असली है।
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-3">
        <li>हर ज्वेलरी का अलग HUID नंबर होता है — जैसे आपकी पहचान का आधार नंबर।</li>
        <li>यह BIS डेटाबेस में दर्ज रहता है, जिससे नकली या मिलावटी ज्वेलरी का खतरा कम होता है।</li>
        <li>HUID से खरीदार को पूरी पारदर्शिता और भरोसा मिलता है।</li>
        <li>2 ग्राम से ज़्यादा वज़न वाले सभी सोने के गहनों की हॉलमार्किंग अनिवार्य है।</li>
        <li>2 ग्राम से कम वज़न वाले सोने के गहनों को हॉलमार्किंग से छूट है।</li>
      </ul>

      <p className="text-gray-800 font-medium">
        अगली बार जब आप सोना या चांदी खरीदें, तो <strong>HUID हॉलमार्क</strong> ज़रूर देखें —
        यही असली और सुरक्षित निवेश की पहचान है।
      </p>

      <div className="bg-white border border-yellow-100 rounded-xl p-4">
        <h3 className="text-yellow-700 font-semibold mb-2">
          हॉलमार्क कहाँ देखें:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="text-center">
            <img
              src="/img/hallmark-sample1.png"
              alt="सोने की चूड़ी पर हॉलमार्क स्थान"
              className="rounded-lg shadow-sm mx-auto"
            />
          </figure>
        </div>
      </div>
    </div>


  );
}

