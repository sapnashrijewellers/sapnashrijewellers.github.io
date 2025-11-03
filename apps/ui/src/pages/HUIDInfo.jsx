import React from "react";

export default function HUIDInfo() {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-card text-card-foreground border border-border rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl text-accent">ℹ️</span>
        <h2 className="text-2xl font-bold text-accent-foreground">
          HUID हॉलमार्किंग क्यों ज़रूरी है?
        </h2>
      </div>

      {/* Description */}
      <p className="leading-relaxed mb-4 text-muted-foreground">
        <strong>HUID (Hallmark Unique Identification)</strong> एक{" "}
        <strong>विशेष 6-अंकों का कोड</strong> होता है, जो हर सोने या चांदी के
        आभूषण पर अंकित किया जाता है। यह कोड यह सुनिश्चित करता है कि आपका
        आभूषण <strong>BIS (भारतीय मानक ब्यूरो)</strong> द्वारा प्रमाणित और असली
        है।
      </p>

      {/* Benefits */}
      <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
        <li>
          हर ज्वेलरी का अलग <strong>HUID नंबर</strong> होता है — जैसे आपकी पहचान का
          आधार नंबर।
        </li>
        <li>
          यह BIS डेटाबेस में दर्ज रहता है, जिससे नकली या मिलावटी ज्वेलरी का खतरा
          कम होता है।
        </li>
        <li>
          HUID से खरीदार को पूरी <strong>पारदर्शिता</strong> और
          <strong> भरोसा</strong> मिलता है।
        </li>
        <li>
          2 ग्राम से ज़्यादा वज़न वाले सभी सोने के गहनों की
          <strong> हॉलमार्किंग अनिवार्य</strong> है।
        </li>
        <li>
          2 ग्राम से कम वज़न वाले सोने के गहनों को हॉलमार्किंग से{" "}
          <strong>छूट</strong> है।
        </li>
      </ul>

      {/* Reminder */}
      <p className="font-medium text-foreground mb-6">
        अगली बार जब आप सोना या चांदी खरीदें, तो{" "}
        <strong className="text-accent">HUID हॉलमार्क</strong> ज़रूर देखें —
        यही <strong>असली और सुरक्षित निवेश</strong> की पहचान है।
      </p>

      {/* Example Section */}
      <div className="bg-muted border border-border rounded-xl p-5">
        <h3 className="text-lg font-semibold text-accent mb-3">
          हॉलमार्क कहाँ देखें:
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <figure className="text-center">
            <img
              src="/img/hallmark-sample1.png"
              alt="सोने की चूड़ी पर हॉलमार्क स्थान"
              className="rounded-xl shadow-sm mx-auto transition-transform duration-300 hover:scale-105"
            />
            <figcaption className="mt-2 text-sm text-muted-foreground">
              सोने की चूड़ी पर HUID और BIS मार्क स्थान
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
